/*
Copyright 2022.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package controllers

import (
	"context"
	"fmt"

	"k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/cli-runtime/pkg/resource"
	"k8s.io/client-go/kubernetes"
	"k8s.io/kubectl/pkg/cmd/apply"

	"github.com/ghodss/yaml"

	api "github.com/hybrid-cloud-patterns/patterns-operator/api/v1alpha1"
)

func applyOneObject(info *resource.Info) error {
	if len(info.Name) == 0 {
		metadata, _ := meta.Accessor(info.Object)
		generatedName := metadata.GetGenerateName()
		if len(generatedName) > 0 {
			return fmt.Errorf("from %s: cannot use generate name with apply", generatedName)
		}
	}

	helper := resource.NewHelper(info.Client, info.Mapping).
		DryRun(false).
		WithFieldManager(apply.FieldManagerClientSideApply)

	// Send the full object to be applied on the server side.
	data, err := runtime.Encode(unstructured.UnstructuredJSONScheme, info.Object)
	if err != nil {
		return err
	}

	forceConflicts := true
	options := metav1.PatchOptions{
		Force: &forceConflicts,
	}

	obj, err := helper.Patch(
		info.Namespace,
		info.Name,
		types.ApplyPatchType,
		data,
		&options,
	)
	if err != nil {
		return err
	}

	info.Refresh(obj, true)
	return nil
}

func haveNamespace(client kubernetes.Interface, name string) bool {
	if _, err := client.CoreV1().Namespaces().Get(context.Background(), name, metav1.GetOptions{}); err == nil {
		return true
	}
	return false
}

func createOwnerRef(p *api.Pattern) metav1.OwnerReference {
	return metav1.OwnerReference{
		APIVersion: api.GroupVersion.String(),
		Kind:       p.Kind, // String
		UID:        p.GetUID(),
		Name:       p.GetName(),
	}
}

func ownedBySame(expected, object metav1.Object) bool {
	ownerReferences := expected.GetOwnerReferences()

	for _, r := range ownerReferences {
		if ownedBy(object, r) == false {
			return false
		}
	}
	return true
}

func ownedBy(object metav1.Object, ref metav1.OwnerReference) bool {

	ownerReferences := object.GetOwnerReferences()

	for _, r := range ownerReferences {
		if referSameObject(r, ref) {
			return true
		}
	}

	return false
}

func objectYaml(object metav1.Object) string {

	if yamlString, err := yaml.Marshal(object); err != nil {
		return fmt.Sprintf("Error marshalling object: %s\n", err.Error())
	} else {
		return string(yamlString)
	}
}

// Returns true if a and b point to the same object.
func referSameObject(a, b metav1.OwnerReference) bool {
	aGV, err := schema.ParseGroupVersion(a.APIVersion)
	if err != nil {
		return false
	}

	bGV, err := schema.ParseGroupVersion(b.APIVersion)
	if err != nil {
		return false
	}

	return aGV.Group == bGV.Group && a.Kind == b.Kind && a.Name == b.Name
}

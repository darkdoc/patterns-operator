import { consoleFetchText } from '@openshift-console/dynamic-plugin-sdk';
import { load } from 'js-yaml';
import { Catalog, Pattern } from './types';

const PROXY_BASE = '/api/proxy/plugin/patterns-operator-console-plugin/pattern-catalog';

export async function fetchCatalog(): Promise<Catalog> {
  const text = await consoleFetchText(`${PROXY_BASE}/catalog.yaml`);
  return load(text) as Catalog;
}

export async function fetchPattern(name: string): Promise<Pattern> {
  const text = await consoleFetchText(`${PROXY_BASE}/${name}/pattern.yaml`);
  return load(text) as Pattern;
}

export async function fetchAllPatterns(): Promise<Pattern[]> {
  const catalog = await fetchCatalog();
  const patterns = await Promise.all(catalog.patterns.map(fetchPattern));
  return patterns;
}

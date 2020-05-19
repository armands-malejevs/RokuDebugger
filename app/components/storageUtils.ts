const Store = require('electron-store');

const store = new Store();

const FILTER_KEY = 'customFilters';

function prepareFilterStore() {
  const filterRoot = JSON.stringify([]);
  store.set(FILTER_KEY, filterRoot);
}

export function saveNewFilter(filter: string) {
  let filters = getFilters();
  if (!filters) {
    // This is the first filter so we need to prepare
    prepareFilterStore();
    filters = getFilters();
  }
  filters.push(JSON.parse(filter));
  const filtersString = JSON.stringify(filters);
  store.set(FILTER_KEY, filtersString);
}

export function updateFilter(filter: string, index: number) {
  const filters = getFilters();
  filters[index] = JSON.parse(filter);
  console.warn(filters);
  store.set(FILTER_KEY, JSON.stringify(filters));
}

export function removeFilter(index: number) {
  const filters = getFilters();
  const removedFilters = filters.filter((v: any, i: number) => {
    return i !== index
  });
  console.warn(removedFilters, index)
  store.set(FILTER_KEY, JSON.stringify(removedFilters));
}

export function getFilters() {
  return JSON.parse(store.get(FILTER_KEY));
}
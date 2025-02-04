export const SearchFilterOps = {
  equal: "_eq",
  greaterThan: "_gt",
  lessThan: "_lt",
  greaterThanOrEqual: "_gte",
  lessThanOrEqual: "_lte",
  contain: "_like",
  startsWith: "_startsWith",
  endsWith: "_endsWith"
};

// Function to capitalize the first letter
export function capFirstLetter(s: string) {
  return s && s[0].toUpperCase() + s.slice(1);
}

// Clears search filters
export function clearSearchFilters(searchFilter: any) {
  if (searchFilter) {
    if (searchFilter.filters) delete searchFilter.filters;

    Object.keys(searchFilter).forEach(filter => {
      if (searchFilter[filter]) {
        Object.keys(searchFilter[filter]).forEach(prop => {
          searchFilter[filter][prop] = null;
        });
      }
    });
  }
}

// Creates a filters object for searching
export function buildSearchFilters(searchFilter: any) {
  const filters: any[] = [];
  if (searchFilter) {
    Object.keys(searchFilter).forEach(filter => {
      if (filter !== "filters") {
        Object.keys(searchFilter[filter]).forEach(propName => {
          if (propName && searchFilter[filter] && searchFilter[filter][propName]) {
            filters.push({
              property: propName,
              op: SearchFilterOps[filter as keyof typeof SearchFilterOps],
              val: searchFilter[filter][propName],
            });
          }
        });
      }
    });
  }
  return filters;
}

// Data filtering function
const filterFn = (op: string, value: any) => (prop: string, data: any) => {
  let propName = "";
  switch (op) {
    case SearchFilterOps.equal:
      propName = prop.replace(SearchFilterOps.equal, "");
      return data[propName] === value;
    case SearchFilterOps.contain:
      propName = prop.replace(SearchFilterOps.contain, "");
      return data[propName].toLowerCase().includes(value.toLowerCase());
    case SearchFilterOps.startsWith:
      propName = prop.replace(SearchFilterOps.startsWith, "");
      return data[propName].toLowerCase().startsWith(value.toLowerCase());
    case SearchFilterOps.endsWith:
      propName = prop.replace(SearchFilterOps.endsWith, "");
      return data[propName].toLowerCase().endsWith(value.toLowerCase());
    case SearchFilterOps.greaterThan:
      propName = prop.replace(SearchFilterOps.greaterThan, "");
      return parseFloat(data[propName]) > parseFloat(value);
    case SearchFilterOps.lessThan:
      propName = prop.replace(SearchFilterOps.lessThan, "");
      return parseFloat(data[propName]) < parseFloat(value);
    case SearchFilterOps.greaterThanOrEqual:
      propName = prop.replace(SearchFilterOps.greaterThanOrEqual, "");
      return parseFloat(data[propName]) >= parseFloat(value);
    case SearchFilterOps.lessThanOrEqual:
      propName = prop.replace(SearchFilterOps.lessThanOrEqual, "");
      return parseFloat(data[propName]) <= parseFloat(value);
  }
};

// Search parameters parsing function
export function getSearchFilters(parsedQs: { [key: string]: any }) {
  const filters = Object.keys(parsedQs).reduce((prev: any, k: string) => {
    const prop = k.split("_")[0];
    const op = "_" + k.split("_")[1];
    const compVal = parsedQs[k];

    if (prop !== "") {
      prev[k] = filterFn(op, compVal);
    }
    return prev;
  }, {});
  return filters;
}

// Email verification
export function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? true : "Email is invalid.";
}

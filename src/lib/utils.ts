export const SearchFilterOps = {
  equal: '_eq',
  greaterThan: '_gt',
  lessThan: '_lt',
  greaterThanOrEqual: '_gte',
  lessThanOrEqual: '_lte',
  contain: '_like',
  startsWith: '_startsWith',
  endsWith: '_endsWith',
};

// Function to capitalize the first letter
export function capFirstLetter(s: string) {
  return s && s[0].toUpperCase() + s.slice(1);
}

// Clears search filters
export function clearSearchFilters(searchFilter: any) {
  const updatedFilter = { ...searchFilter };

  if (updatedFilter.filters) {
    delete updatedFilter.filters;
  }

  Object.keys(updatedFilter).forEach((filter) => {
    if (updatedFilter[filter]) {
      Object.keys(updatedFilter[filter]).forEach((prop) => {
        updatedFilter[filter][prop] = null;
      });
    }
  });

  return updatedFilter;
}

// Creates a filters object for searching
export function buildSearchFilters(searchFilter: any) {
  const filters: any[] = [];
  if (searchFilter) {
    Object.keys(searchFilter).forEach((filter) => {
      if (filter !== 'filters') {
        Object.keys(searchFilter[filter]).forEach((propName) => {
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
  const propName = prop.replace(op, '');

  switch (op) {
    case SearchFilterOps.equal:
      return data[propName] === value;
    case SearchFilterOps.contain:
      return data[propName]?.toLowerCase().includes(value.toLowerCase());
    case SearchFilterOps.startsWith:
      return data[propName]?.toLowerCase().startsWith(value.toLowerCase());
    case SearchFilterOps.endsWith:
      return data[propName]?.toLowerCase().endsWith(value.toLowerCase());
    case SearchFilterOps.greaterThan:
      return parseFloat(data[propName]) > parseFloat(value);
    case SearchFilterOps.lessThan:
      return parseFloat(data[propName]) < parseFloat(value);
    case SearchFilterOps.greaterThanOrEqual:
      return parseFloat(data[propName]) >= parseFloat(value);
    case SearchFilterOps.lessThanOrEqual:
      return parseFloat(data[propName]) <= parseFloat(value);
    default:
      // console.warn(`Unknown search operator: ${op}`);
      return false;
  }
};

// Search parameters parsing function
export function getSearchFilters(parsedQs: { [key: string]: any }) {
  const filters = Object.keys(parsedQs).reduce((prev: any, key: string) => {
    const value = parsedQs[key];
    if (!value) return prev;

    const [prop, op] = key.split('_');
    const operator = op ? `_${op}` : SearchFilterOps.contain;

    return {
      ...prev,
      [prop + operator]: filterFn(operator, value),
    };
  }, {});
  return filters;
}

// Email verification
export function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? true : 'Email is invalid.';
}

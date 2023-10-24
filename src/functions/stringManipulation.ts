const camelCase = (string: string) => {
  const stringUpdate = string
    .toLowerCase()
    .replace(/(^.)|([-_\s]+.)/g, match => match.charAt(match.length - 1).toUpperCase());
  return stringUpdate.charAt(0).toLowerCase() + stringUpdate.substring(1);
};

const snakeCase = (string: string) => {
  const matches = string.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
  );

  if (!matches) {
    return string;
  }

  return matches.map((ch: string) => ch.toLowerCase()).join('_');
};

const kebabCase = (input: string): string => {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

const trim = (string: string) => string.replace(/^\s+|\s+$/gm, '');

export { camelCase, snakeCase, kebabCase, trim };

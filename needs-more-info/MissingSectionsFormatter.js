class MissingSectionsFormatter {
  format(response, invalidSections) {
    if (!invalidSections.length) return response;

    const manySections = invalidSections.length > 1;
    const beginning = `It looks like${manySections ? ' sections' : ''}`;
    const ending = `${manySections ? 'are' : 'section is'} missing.`;

    if (manySections) {
      const invalidSectionsCopy = [...invalidSections];
      const last = invalidSectionsCopy.pop();
      const formattedSections = invalidSectionsCopy.map((section) => ` ${section}`);
      return `${response} ${beginning}${formattedSections} and ${last} ${ending}`;
    }

    return `${response} ${beginning} ${invalidSections[0]} ${ending}`;
  }

  parse(semicolonSeparatedString) {
    return semicolonSeparatedString.split(';');
  }
}

module.exports = MissingSectionsFormatter;

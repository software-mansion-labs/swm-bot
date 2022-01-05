class MissingSectionsFormatter {
  format(response, invalidSections) {
    if (!invalidSections.length) return response;

    const manySections = invalidSections.length > 1;
    const beginning = `Please complete`;
    const ending = `section${manySections ? 's' : ''}.`;

    if (manySections) {
      const invalidSectionsCopy = [...invalidSections];
      const last = invalidSectionsCopy.pop();
      const formattedSections = invalidSectionsCopy.map((section) => ` **${section}**`);
      return `${response}\n\n${beginning}${formattedSections} and **${last}** ${ending}`;
    }

    return `${response}\n\n${beginning} **${invalidSections[0]}** ${ending}`;
  }

  parse(semicolonSeparatedString) {
    return semicolonSeparatedString.split(';');
  }
}

module.exports = MissingSectionsFormatter;

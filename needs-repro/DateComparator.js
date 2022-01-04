class DateComparator {
  isDateBefore(firstDate, secondDate) {
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);

    return date1.getTime() < date2.getTime();
  }
}

module.exports = DateComparator;

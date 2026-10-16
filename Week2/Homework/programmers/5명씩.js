function solution(names) {
  return names.filter(function (name, index) {
    return index % 5 === 0;
  });
}

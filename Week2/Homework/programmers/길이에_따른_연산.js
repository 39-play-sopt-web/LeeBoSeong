function solution(num_list) {
  if (num_list.length >= 11) {
    // 합은 0부터 시작해서 숫자를 하나씩 더합니다.
    return num_list.reduce(function (sum, number) {
      return sum + number;
    }, 0);
  }

  // 곱은 1부터 시작해서 숫자를 하나씩 곱합니다.
  return num_list.reduce(function (product, number) {
    return product * number;
  }, 1);
}

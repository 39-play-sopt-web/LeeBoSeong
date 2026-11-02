function solution(num_list) {
  let odd = '';
  let even = '';

  // 문자열에 더하면 숫자가 계산되지 않고 순서대로 이어 붙습니다.
  num_list.forEach(function (number) {
    if (number % 2 === 0) {
      even += number;
    } else {
      odd += number;
    }
  });

  // 이어 붙인 문자열을 숫자로 바꾼 뒤 더합니다.
  return Number(odd) + Number(even);
}

export type Example = {
  label: string;
  language: "C" | "C++" | "JavaScript";
  code: string;
};

export const EXAMPLES: Example[] = [
  {
    label: "Prime check (C)",
    language: "C",
    code: `#include <stdio.h>

void checkPrime(int n) {
    int count = 0;
    for (int i = 1; i <= n; i++) {
        if (n % i == 0) count++;
    }
    if (count == 2) printf("Prime\\n");
    else printf("Not Prime\\n");
}

int main() {
    checkPrime(7);
    return 0;
}
`,
  },
  {
    label: "Fibonacci (C++)",
    language: "C++",
    code: `#include <iostream>
using namespace std;

int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    for (int i = 0; i < 8; i++) {
        cout << fib(i) << " ";
    }
    return 0;
}
`,
  },
  {
    label: "Array sum (JS)",
    language: "JavaScript",
    code: `function sumArray(nums) {
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    total += nums[i];
  }
  return total;
}

console.log(sumArray([1, 2, 3, 4, 5]));
`,
  },
  {
    label: "Reverse string (JS)",
    language: "JavaScript",
    code: `function reverseString(str) {
  return str.split("").reverse().join("");
}

console.log(reverseString("hello"));
`,
  },
];
"use strict";

/*

Given an array nums of size n, return the majority element.

The majority element is the element that appears more than ⌊n / 2⌋ times. 
You may assume that the majority element always exists in the array.

 

Example 1:

Input: nums = [3,2,3]
Output: 3
Example 2:

Input: nums = [2,2,1,1,1,2,2]
Output: 2

*/
//________________________________________________________________________________
{

  const arr = [3, 2,3];
  let maxCount = 0;
  let majorElement = null
  function majorityElement(array) {
    for (let index = 0; index < array.length; index++) {
      let count = 0;
      for (let y = 0; y < array.length; y++) {
        if (array[index] === array[y]) {
          count++;
        }
      }
      if (count > maxCount) {
        maxCount = count;
        majorElement = array[index];
      }
    }
    return majorElement;
   }

  console.log(majorityElement(arr));
}

//or  the Boyer-Moore Voting Algorithm
{
  function majorityElement(nums) {
    let candidate = null;
    let count = 0;

    for (let num of nums) {
      if (count === 0) {
        candidate = num;
      }
      count += num === candidate ? 1 : -1;
    }

    return candidate;
  }

  console.log(majorityElement([3, 2, 3])); // Output: 3

  console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // Output: 2  
  
}

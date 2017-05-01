/* eslint-disable */
let tricky_1 = (a_2, b_3, c_4) => {
  return c_4(a_2)(b_3);
};
let add2_5 = (a_6) => {
  let add1_7 = (b_8) => {
    return (a_6 + b_8);
  };
  return add1_7;
};
let sum_9 = tricky_1(1, 2, add2_5);

/* eslint-disable */
let tricky_2 = (a_3, b_4, c_5) => {
  return c_5(a_3)(b_4);
};
let add2_6 = (a_7) => {
  let add1_8 = (b_9) => {
    return (a_7 + b_9);
  };
  return add1_8;
};
let sum_10 = tricky_2(1, 2, add2_6);

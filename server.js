import express from 'express';
import { data } from './data.js';
const app = express();
const port = 5000;
app.use(express.json());

//*******题目*********************/
//Task:
//1. create api endpoint: localhost:5000/posts-single-tag?tag=tech
//2. create api endpoint: localhost:5000/posts-multiple-tags?tags=tech,history,health, by calling localhost:5000/posts-single-tag/tag=tech
app.get('/posts-single-tag', async (req, res) => {
  const tag = req.query.tag;
  const result = data.filter((v) => v.tags.includes(tag));
  // console.log(result);
  return res.status(200).send(result);
});

const fetchAndParse = async (url) => {
  const response = await fetch(url);
  return response.json();
};
app.get('/posts-multiple-tags', async (req, res) => {
  const tags = req.query.tags.split(',');
  const urls = tags.map(
    (tag) => `http://localhost:5000/posts-single-tag?tag=${tag}`
  );
  const arrayOfPromises = urls.map((url) => fetchAndParse(url));
  const data = await Promise.all(arrayOfPromises);
  // const result = data.reduce((acc, curr) => [...acc, ...curr], []);
  //.flat() is an array method that creates a new array with
  // all sub-array elements concatenated into it recursively
  // up to the specified depth.

  const flatData = data.flat();
  // console.log(flatData);

  // 方法1. 使用 some 循环 来去重
  // const uniqueData = flatData.reduce((acc, item) => {
  //   if (!acc.some((existingItem) => existingItem.id === item.id)) {
  //     acc.push(item);
  //   }
  //   return acc;
  // }, []);
  // return res.status(200).send(uniqueData);

  // 方法2. 使用 for 循环 来去重
  // const seen = {};
  // const uniqueData = [];

  // for (const item of flatData) {
  //   if (!seen[item.id]) {
  //     seen[item.id] = true;
  //     uniqueData.push(item);
  //   }
  // }
  // return res.status(200).send(uniqueData);

  // 方法3. 使用 reduce 来去重
  // const finalresult = Object.values(
  //   flatData.reduce((acc, item) => {
  //     acc[item.id] = item;
  //     return acc;
  //   }, {})
  // );
  // return res.status(200).send(finalresult);

  // 方法4. 使用 Map 来去重
  // const uniqueMap = new Map();
  // flatData.forEach((item) => {
  //   if (!uniqueMap.has(item.id)) {
  //     uniqueMap.set(item.id, item);
  //   }
  // });
  // const finalresult = Array.from(uniqueMap.values());

  // return res.status(200).send(finalresult);
  //方法5. 使用 filter 和find 来去重
  const uniqueData = flatData.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );
  return res.status(200).send(uniqueData);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

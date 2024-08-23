import express from 'express';
import { data } from './data.js';
const app = express();
const port = 5000;
app.use(express.json());

// app.get('*', (req, res) => {
//   const endpoint = req.originalUrl.slice(1);
//   console.log('请求端点:', endpoint);
//   res.json(data[endpoint]);
// });
// app.use('*', (req, res) => {
//   console.log('Request path:', req.path);
//   console.log('Full URL:', req.url);
//   const requestedPath = req.path;
//   res.json(data[requestedPath]);
// });
// app.get('/users', (req, res) => {
//   res.json(data.users);
// });
//Task: 
//1. create api endpoint: localhost:5000/posts-single-tag?tag=tech
//2. create api endpoint: localhost:5000/posts-multiple-tags?tags=tech,history,health, by calling localhost:5000/posts-single-tag/tag=tech
app.get("/posts-single-tag", async (req, res) => {
  const tag = req.query.tag
  const result = data.filter(v=> v.tags.includes(tag))
  return res.status(200).send(result);
})


const fetchAndParse = async (url) => {
  const response = await fetch(url);
  return response.json();
};
app.get("/posts-multiple-tags", async (req, res) => {
  const tags = req.query.tags.split(",");
  const urls = tags.map((tag) => `http://localhost:5000/posts-single-tag?tag=${tag}`)
  const arrayOfPromises = urls.map(url => fetchAndParse(url)); 
  const data = await Promise.all(arrayOfPromises);
  const result = data.reduce((acc, curr) => [...acc, ...curr], []);
  return res.status(200).send(result);
})
// app.get("/posts-multiple-tags", async (req, res) => {
//   const tags = req.query.tags.split(",");
//   const urls = tags.map((tag) => `http://localhost:5000/posts-single-tag?tag=${tag}`)
//   const response_promises = urls.map((url) => fetch(url))
//   const responses = await Promise.all(response_promises);
//   const data = await Promise.all(responses.map((response) => response.json()))
//   const result = data.reduce((acc, curr) => [...acc, ...curr], []);
//   return res.status(200).send(result);
// })
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

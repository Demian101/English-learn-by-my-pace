import cloudinary from "cloudinary";
import compression from 'compression';
import cors from "cors";
import dotenv from 'dotenv';
import express, { Express, Request, Response } from "express";
import helmet from 'helmet';
import morgan from 'morgan';
import connectDb from "./config/db";
import wordRoutes from "./routes/wordRoutes";
import sentenceRoutes from "./routes/sentenceRoutes";
import speechRoutes from "./routes/speechRoutes"

// loads environment variables from a `.env` file into `process.env`. 
dotenv.config({ path:"./.env"  });

// define port
const PORT =  process.env.PORT || 8080;
console.log("Port is : ", process.env.PORT)
console.log("CLOUDINARY_API_SECRET is : ", process.env.CLOUDINARY_API_SECRET)



// initialize express
const app: Express = express();

// initialize helmet to secure express app
app.use(helmet());

// serve static files found in the public sub-directory automatically
app.use(express.static("public")); 

//connect to db
connectDb();

// configure cloudinary 

// cloudinary.v2.config({
//   cloud_name: "social-network-101",
//   api_key: "397828424674875",
//   api_secret: "ZRMnO8CC7-SY-kUOXU9sjGRRNNc",
// });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// initialize cors 处理跨域问题
app.use(cors({ origin: "*", credentials:true, }));

// Other Middlewares
app.use(compression());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 定义一个 打印内容的全局中间件（ 用 clg 不好！ 用日志系统！！）
app.use(function(req: Request, res: Response, next){
  //console.log('------- req.params : ------- ', req.params) // 非常复杂。。
  // console.log('------- req.query : ------- ', req.query)
  //console.log('------- req.body : ------- ', req.body)
  
  // const keys = Object.keys(res);
  // console.log('res.keys: ', keys);
  next()
})

// Routes
app.get("/api", (req: Request, res: Response) => {
  res.send('<h1>Social Network API</h1>');
});
app.use("/api/word", wordRoutes)
app.use("/api/sen", sentenceRoutes)
app.use("/api/speech", speechRoutes)


// initialize server
app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
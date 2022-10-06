# 前端 Frontend

## Layout



## TTS 语音合成

```
https://github.com/thaispalmer/talkify-tts-api
https://www.npmjs.com/package/talkify-tts
https://manage.talkify.net/ （ Google+ login）

npm i talkify-tts-api --save

Api-key： a663c170-e72f-4e54-a218-84de6ee8bd8e
```



### python3 gTTS

```
https://www.geeksforgeeks.org/convert-text-speech-python/

可以用文本的 md5 编码做为文件名，实现不同的文本对应不同的文件，如果已经生成了对应的文件，无需重复生成，直接返回即可
```



fastapi	

```
pip3 install fastapi
pip3 install pyttsx3
pip3 install "uvicorn[standard]"


python3 -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```









## Sentence(Setcs)

```bash
Setcs   ( query topN)
  sentPreview  ( show single info, feedback)
```







不好解决的遗留问题: 

```js
1. WordById.derivation 中的 ID 重复 : 
WordById.derivation:  [
  new ObjectId("630a1f5ea480451e641a5fa8"),
  new ObjectId("630a1f5ea480451e641a5fa8"),
]
```



```React
// 组件层级

<Main />       // Fetch Data
  <WordPreview />   // 显示 wordCurrent  的信息 + 控制内容

```



单词样本：

```bash
# 第一个主词：
illustrate  /'ɪləstreɪt/  v. 表明；说明；证明
-ill  ....
label1,label2
illustrate his point. 
说明他的论点
illustrate all the changes/illustrate date
解释变化/解释数据
[isInRankList]

# 第二个主词：
illustration  /ˌɪlə'streɪʃn/  n. 例证; 说明
[isSlave]

# 近反义词
interpretation  /ɪnˌtɜːrprɪ'teɪʃn/ n. 解释, 说明, 阐明
interpret  /in'tə:prit/  vi. 解释；翻译
> She interpret his silence as arrogance. 她把他的沉默解释为傲慢。
> It is difficult for many people to accept the interpretation.
> 很多人难以接受这个解释。


Extension POST -

illustrate
衍生：illustration
近反义词：interpret,interpretation
```



分 Master Slave 的原因 ？ 



待开发:

```
单词句中高亮;
提交成功的弹窗;
每日打卡系统


前端 React-Query:
- 用户注册/登录 ;

后端 API : 
- [post] word Add
```





开发原则: 

1. 样式后期再细调, 前期关注功能 ; 
2. 前端一开始使用 strapi 进行 fake ;



开发日记: 

```
0821 : 确定开发技术栈, 制作前端样板文件
0822 : 
  √ 单词展示页
```



# Mongo

words 是空的，没插进去，所以 populate 不出来。





```
> mongo
show databases;
use myapp;

show tables;


db.words.find({word: 'fund'});

db.words.remove({word: 'fund'});

db.forms.find({_id: ObjectId("633590fe8579c76ec77dd769")})
db.forms.remove({_id: ObjectId("633590fe8579c76ec77dd769")})

db.words.findOneAndUpdate({word: 'fund'}, {
  $set: { 
    derivation: []
  }
}, {new: true});



测试 populate：

db.sentences.findOne({_id: 6337020c6e918227b328c005});

db.sentences.find({_id: '6337020c6e918227b328c005'});


db.sentences.find({_id: ObjectId("63370fa36c1468ae35d3b5df")});

db.sentences.find({_id: ObjectId("63379089badc2aba0892540f")});


```





## 踩坑：

> 向 `Array<Object> ` 添加数据时， 使用 for 而不是 forEach， 且要使用 await
>
> 否则可能插入不成功。

```tsx
正确：
      for (const word of words) {   // 注意：向
        await Word.findOne({word}).then( (res)=> {
          sent_.words?.push(res?._id);
        })
      }

错误：
      words.forEach (word: any ) {   // 注意：向
        Word.findOne({word}).then( (res)=> {
          sent_.words?.push(res?._id);
        })
      }
```





# 后端 API ：

````bash
# DB：
sudo mongod --dbpath /usr/local/mongodb/data/engdb

# 例句数据
如果成功，该提案(proposal)将资助 “Friends With Beans” 计划的试运行( pilot run )
If successful, this proposal will fund a pilot run of the Friends With Beans program


````





## API Postman 测试

### api/Word/

#### AddWord

1. 添加 `Word` 时，不添加例句，例句在另一个页面添加，同时 append 到每个 Word 的 examples 里面。

2. word 可对应多个派生同源、近义词，易混词，这些词可不作为主词，也可作为主词，其边界不确定。

```JS
api: /api/word/
method: POST
url: http://localhost:8080/api/word

body:


{
  "word" : "forfeit",
  "soundmark": "/'fɔːrfət/",
  "definition": "v. 丧失，被没收  n. 罚款；没收物",
  "rootOrAffix": "-feit 【拉丁】表示“做，制作”，生产"
}

{
  "word" : "deposit",
  "soundmark": "/dɪ'pɑːzɪt/",
  "definition": "n. 存款；定金  v. 存储；寄存",
  "rootOrAffix": "pos- 放置 de-下面 → 储存",
  "label": ["economy", "finance"]
}

```



#### getCognitionTopN

```js
api: /api/word/topN
method: GET
url: http://localhost:8080/api/word/topN



```







#### addWordExtension

```js
/* 对 Extension 拓展信息的补充 'extension'  */

api: /api/word/:id/addition
method: PUT
url:  http://localhost:8080/api/word/intrinsic/addition

-----   是 intrinsic 的派生词：  -----
-----    是 intrinsic 的同义词：  -----

body 
( 1. 注意 PUT 方式，
  2. "extrinsic, extrinsic2, extrinsic3",) 是在一个字符串里，用 ’,‘ 连接。
{
  "derivation": "extrinsic",
  "synonym": "inherent"
}


```



#### checkWordsExistence

- 后端 Sentence ，传入句子，检查里面有没有已存在的单词，用绿色在前端标出。



### api/sen/

#### AddSentence

```js
api: /api/sen/
method: POST
url: http://localhost:8080/api/sen

body: {
  "zh": "如果您现在取消的话，恐怕您不能拿回订金。",
  "en": "I'm afraid that you may forfeit your deposit if you cancel now...",
  "words": ["forfeit", "deposit"]
}

{
  "en": "---- If successful, this proposal will fund a pilot run of the Friends With Beans program",
  "zh": "如果成功，该提案(proposal)将资助 “Friends With Beans” 计划的试运行( pilot run )",
  "words": ["fund","funder"]
}


{
  "en": "proposal will fund a pilot run of the Friends With Beans program",
  "zh": "如果成功，该提案(proposal)将资助 “Friends With Beans” 计划的试运行( pilot run )",
  "words": ["testword","proposal","fund"]
}

{
  "en": "I fund a pilot run of the Friends With Beans program",
  "zh": "如果成功，该提案(proposal)将资助 “Friends With Beans” 计划的试运行( pilot run )",
  "label": ["web3", "blockchain"],
  "words": ["proposal","fund"]
}

{
  "en": "Cosmos is an ever-expanding ecosystem of interconnected apps",
  "zh": "Cosmos 是一个不断扩展的互联应用生态系统",
  "label": ["web3", "blockchain"],
  "words": ["proposal","fund"]
}

{
  "en": "The law essentially grants DAOs the same privileges as limited liability corporations.",
  "zh": "法律本质上授予 DAO 与有限责任公司相同的特权。",
  "label": ["web3", "blockchain"],
  "words": ["proposal","fund"]
}

```



#### editSentence

```JS
api: /api/sen/:id/edit 
method: PUT
url: http://localhost:8080/api/sen/6337967f06778dc47a360714/edit

body:
{
  "en": "ooo I fund a pilot run of the Friends With Beans program",
  "zh": "ooo 如果成功，该提案(proposal)将资助 “Friends With Beans” 计划的试运行( pilot run )",
  "label": ["web3", "tech","go it","blockchain"],
  "words": ["fund","funder"]
}
```





#### getCognitionTopN

> 获取认知度排名最低的 N 个 句子

```js
api: /api/sen/topN
method: GET
url: http://localhost:8080/api/sen/topN

// populate 成功

[{
    "idc": { "cognition": 0 },
    "_id": "63379dbfeb74a867d7e3fc21",
    "en": "I fund a pilot run of the Friends With Beans program",
    "zh": "如果成功，该提案(proposal)将资助 “Friends With Beans” 计划的试运行( pilot run )",
    "label": ["web3", "blockchain"],
    "words": [
      {
        "ex....": "..",
        "idc": { "cognition": 0 },
        "_id": "63378ed60cc7da3455871467",
        "word": "testword",
        "definition": "测试词"
      }, 
      {
        "ex....": "..",
        "idc": { "cognition": 0 },
        "_id": "xxxxx",
        "word": "fund"
      }
    ]
```





#### calculateSimilarity

```
https://www.npmjs.com/package/string-similarity
npm install string-similarity --save

stringSimilarity.compareTwoStrings(
  "Olive-green table for sale, in extremely good condition.",
  "For sale: table in very good  condition, olive green in colour."
);
// → 0.6060606060606061
```





### api/speech

```js
router.get('/:id/audio', soundStream)
api :  /api/speech/:id/audio
method: GET
url :   http://localhost:8080/api/speech/:id/audio
```











# Preview

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-06-28-144156.png" style="zoom:40%;" />

运行项目：

```bash
yarn
yarn dev
or yarn preview

打包： yarn build
```





### tailwind 讲解 

relative 相对定位 : 

- 如果想让子元素相对于父元素绝对定位 , 使用子绝父相 ; 
- 如果子元素和父元素都是 relative , 那么都是相对于文档流来定位, 互不影响

```react
      <div className="relative w-full h-5 ">
        <img src={big_right_circle} width="256" height="256"
          viewBox="0 0 256 256" className="absolute right-0 -z-10" />
      </div>
这里的 big_right_circle 相对于 div 父元素绝对定位
div 父元素遵循文档流 ,在上一个 div 的下面自然出现 ;
```



  

`grid justify-items-center` : 

上下分别是 无 `justify-items-center`  和 有 `justify-items-center`  的区别 : 

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-06-29-020406.png)





# Todo

- [x] 10.04

  - [x] Word 的数据结构更改

  - [x] 例如 character 、 characterize 2 个含义不同，但是同样常用的 2 个词， 可以同时作为主词。

  - [x] 添加`Sentences`   时，自动建立 `Word - 例句` 双向连接。

  - [x] 用起来，Postman 添加一部分句子和词。

  - [ ] similarity 的计算加到前端

- [ ] 10.06
  - [ ] 后端 Word ，传入单词，检查里面有没有已存在的，用绿色标出。
  - [ ] 后端 Sentence ，传入句子，检查里面有没有已存在的单词，用绿色在前端标出。
  - [x] 忽然觉得不应该有主词和派生。（这个放到之后确实需要的话，手动在全库操作吧）



# Real Data

## Sentences

### Web

```
The scientist has to develop a coherent view of the natural world.
科学家必须建立一个关于自然世界的连贯观点。
coherent



The subjects of the curriculum form a coherent whole. 
课程中的科目构成了一个连贯的整体。
coherent



For ten months he adhered to a strict no-fat low-salt diet.
十个月来他一直都坚持严格的无脂少盐饮食。
adhere

The movement is gaining more and more adherents.
支持这个运动的人越来越多了。
adherent
```





### Json

```json
{
  "zh": "",
  "en": "",
  "words": [""]
}

{
  "zh": "教育的内在价值在于保持一个民族的前进动力。",
  "en": "The intrinsic value of education is to maintain a nation's forward momentum.",
  "words": ["intrinsic"]
}

{
  "zh": "渴望自由是我们大家生来就有的愿望。（desire to 也可以）",
  "en": "The desire for freedom is inherent in us all.",
  "words": ["inherent"]
}

{
  "zh": "法律本质上授予 DAO 与有限责任公司相同的特权。",
  "en": "The law essentially grants DAOs the same privileges as limited liability corporations(LLCs).",
  "words": ["essential", "deposit"]
}

{
  "zh": "竞争是必要的，一个只有苹果公司生产智能手机的世界会很糟糕（虚拟语气）",
  "en": "Competition is necessary. A world where only Apple makes smartphones would suck."
}

{
  "zh": "每个技术都有他的优缺点",
  "en": "Each technology has its pros and cons."
}

{
  "zh": "她太过羞涩，无法明确表达自己的想法。",
  "en": "She is too shy to articulate her thoughts.",
  "words": ["articulate"]
}

{
  "zh": "对教师来说,口齿清楚是必不可少的。",
  "en": "Articulate speech is essential for a teacher.",
  "words": ["articulate", "essential"]
}

{
  "zh": "大众教育对于促进民主至关重要",
  "en": "Mass education is essential in promoting democracy. ",
  "words": ["essential"]
}
```



## words

```json
{
  "word" : "",
  "soundmark": "",
  "definition": "",
  "rootOrAffix": "",
  "label": [],
  "phrase": []
}
--------# 派生测试 #----------
{
  "word" : "intrinsic",
  "soundmark": "/ɪn'trɪnsɪk/",
  "definition": "adj. 固有的, 内在的 (常用 6000 词)"
}
{
  "word" : "inherent",
  "soundmark": "/ɪn'hɪrənt/",
  "definition": "adj. 固有的；内在的"
}
{
  "word" : "extrinsic",
  "definition": "adj. 非固有的；非本质的；外在的 （2W 词）"
}
-----  extrinsic 是 intrinsic 的派生词：  -----
-----  inherent  是 intrinsic 的同义词：  -----




--------# 派生测试 #----------
{
  "word" : "forfeit",
  "soundmark": "/'fɔːrfət/",
  "definition": "v. 丧失，被没收  n. 罚款；没收物",
  "rootOrAffix": "-feit 【拉丁】表示“做，制作”，生产"
}

{
  "word" : "deposit",
  "soundmark": "/dɪ'pɑːzɪt/",
  "definition": "n. 存款；定金  v. 存储；寄存",
  "rootOrAffix": "pos- 放置 de-下面 → 储存",
  "label": ["economy", "finance"]
}

{
  "word" : "articulate",
  "soundmark": "/ɑːr'tɪkjuleɪt/",
  "definition": "v./adj. 说, 表达, 清晰认真地发音",
  "rootOrAffix": "artic-【拉丁】关节；分成间断的；说话清晰的"
}

{
  "word": "articulation",
  "soundmark": "/ɑːrˌtɪkjuˈleɪʃn/",
  "definition": "n. 发音, （思想感情的）表达, 说话"
}
  
{
  "word" : "essence",
  "soundmark": "/'esns/",
  "definition": "n. 本质；要素；精髓"
}

{
  "word" : "essential",
  "soundmark": "/ɪ'senʃl/",
  "definition": "adj. 本质的；必要的",
  "phrase": ["different in essence: 本质上不同"]
}

{
  "word" : "fundamental",
  "soundmark": "/ɪ'senʃl/",
  "definition": "adj. 基本的 n. 基础",
  "rootOrAffix": "fund-, found- 【拉丁】表示“底部，基地”"
}
```





## 备忘录文件（已整理）- Eng：

Label：diet，economy，finance

```json
articulate  /ɑːr'tɪkjuleɪt/  v./adj. 说, 表达, 清晰认真地发音,  
articulation  发音, （思想感情的）表达, 说话
> She is too shy to articulate her thoughts.    v.
> 她太过腼腆羞涩，无法明确表达自己的想法。
>	Articulate speech is essential for a teacher.   adj. 对教师来说,口齿清楚是必不可少的。

essence  /'esns/  n. 本质；要素；精髓
-different in essence   本质上不同
essential   adj. 本质的；必要的；重要的
-Mass education is essential in promoting democracy. 
-大众教育对于促进民主至关重要
fundamental  基本的

#### 派生测试 ##### 

intrinsic  /ɪn'trɪnsɪk/  adj. 固有的, 内在的 （常用 6000 词）
extrinsic adj. 非固有的；非本质的；外在的 （2W 词）
> The intrinsic value of education is to maintain a nation's forward momentum.
> 教育的内在价值在于保持一个民族的前进动力。

inherent  /ɪn'hɪrənt/  adj. 固有的；内在的
-The desire for freedom is inherent in us all. -渴望自由是我们大家生来就有的愿望。


coherent  /koʊ'hɪrənt/ adj. 条理的、一致的，连贯的，黏在一起的。
co- 一起 -> 连贯
The scientist has to develop a coherent view of the natural world.
科学家必须建立一个关于自然世界的连贯观点。

The subjects of the curriculum form a coherent whole. 
课程中的科目构成了一个连贯的整体。

派生： cohere /koʊ'hɪr/ v. 粘合，连结，附着


派生： adhere /əd'hɪr/ vi.黏着、附着、坚持
-For ten months he adhered to a strict no-fat low-salt diet.
-十个月来他一直都坚持严格的无脂少盐饮食。


派生： adherent /əd'hɪərənt/ n. 拥护者，信徒
-The movement is gaining more and more adherents.
-支持这个运动的人越来越多了。



prevail  /prɪ'veɪl/  v. 流行, 盛行; 获胜; 占优势
prevalent  /'prevələnt/  adj. 流行的，盛行的
prevalence  /'prevələns/  n. 流行; 普遍; 流行程度
-prevail on 劝说 , I tried to prevail on him to stay. 我曾劝他留下
-Virtue will prevail against evil.  美德定将战胜邪恶。
-The prevalent opinion is in favour of reform.
-舆论普遍支持改革。

previous  /'priːviəs/  adj. 先前的，早先的；上一次的
-此类工作的经验 previous experience of this kind of work
-It happened previous to his arrival there. 
事件发生于他到那儿以前。
```



## 备忘录文件（已整理）- Web3：







# React-Query

## 单击按钮时如何使用 RQ ?

According to the [API Reference](https://react-query.tanstack.com/reference/useQuery), you need to change the `enabled` option to **false** to disable a query from automatically running. Then you refetch manually.

根据 API Reference，您需要将 enabled 选项更改为 false 以禁用查询自动运行。然后你手动重新获取。

```react
// emulates a fetch (useQuery expects a Promise)
const emulateFetch = _ => {
  return new Promise(resolve => {
    resolve([{ data: "ok" }]);
  });
};

const handleClick = () => {
  // manually refetch
  refetch();
};

const { data, refetch } = useQuery("my_key", emulateFetch, {
  refetchOnWindowFocus: false,
  enabled: false // disable this query from automatically running
});

return (
  <div>
    <button onClick={handleClick}>Click me</button>
    {JSON.stringify(data)}
  </div>
);
```



另一个答案：

>  You have to pass the `manual: true` parameter option so the query doesn't fetch on mount.以便查询不会在挂载时自动获取
>
>  Also, you should pass `fetchData` without the parentheses（括号）, so you pass the function reference and not the value. To call the query you use refetch().

```js
const {status, data, error, refetch} = useQuery(myKey, fetchData, {
      manual: true,
    });

const onClick = () => { refetch() }
```



## 手动 fetch 而不是自动执行查询

```react

  // 这就是 React-Query 处理禁止自动查询（改为手动触发如 Button 触发的方式）：
  // ① 先设refetch ② 将 enabled 设为 false 
  const { isLoading: isLoadingSentenceInfo, refetch: checkWordsExistence } = useQuery(
    "check-Words-Existence",
    async () => {
      console.log('check-Words-Existence')
      return await httpClient.get(`/word/data/${wordExt}`)
    }, 
    {
      onSuccess: (res) => { setPostResult({status: 'success',res: res}) },
      onError: (err) => { setPostResult({status: 'error', res: err.response?.data || err});},
      refetchOnWindowFocus: false,
      enabled: false  // 禁用查询自动运行
    } 
  );
```



## pass params to React-query

传递给 react-query 的查询函数会注入一个 queryContext，它是一个由 queryKey 组成的对象（如果您使用的是无限查询，还有更多信息）。所以是的，访问依赖项的一种正确方法是通过 `queryKey`：

```react
export const getProduct = async ({ queryKey }) => {
    const [_, prodId] = queryKey
    const { data } = await axios.get(`/api/v1/products/${prodId}`)
    return data
}
const { data } = useQuery(['product', prodId], getProduct)
```



Another way is to use inline anonymous functions(内联匿名函数), which is well documented in the docs in: [If your query function depends on a variable, include it in your query key](https://react-query.tanstack.com/guides/query-keys#if-your-query-function-depends-on-a-variable-include-it-in-your-query-key)

```react
export const getProduct = async (prodId) => {
    const { data } = await axios.get(`/api/v1/products/${prodId}`)
    return data
}
const { data } = useQuery(['product', prodId], () => getProduct(prodId))
```



## 条件查询、依赖查询

The key was to use [Dependent Queries](https://react-query.tanstack.com/guides/dependent-queries)

So, in my main component, I create a boolean and pass that to the `enabled` option of the `useQuery` hook:

如下例， 只有当输入字符长度 > 3 时， 查询才会触发：

1. `['search', searchString] `  --- 要点 1 
2. ` {enabled: isLongEnough}`   --- 要点 2 

```js
const isLongEnough = searchString.length > 3;
const {data, isLoading} = useQuery(['search', searchString], getSearchResults, {enabled: isLongEnough});
```

and the API calling method is simply the API call - not any conditional:

```js
const getSearchResults = async (_, searchString) => {
    const {data} = await axios.get(`/search?q=${searchString}`);
    return data;
}
```


import { addWord, fetchWords } from "../api/PostApi";

import { useQuery, useMutation } from "react-query";
import { queryClient } from "../lib/react-query";

const ReactQueryTest = () => {
  // 获取数据 data ； 
  const { data } = useQuery("TMP", () => {
    return fetch("https://jsonplaceholder.typicode.com/todos/1").then(
      (response) => {
        // console.log("response arrives");
        if (response.ok) {
          return response.json();
        }
      }
    );
  });

  // ADD 数据 到后端
  const { mutate } = useMutation(addWord);

  function submitWord(data, e) {
    console.log('da', data);
    mutate(data, {
      onSuccess: () => {
        console.log('onSuccess');
        //  QueryClient 包含一个 invalidateQueries 方法，可以智能地将查询标记为过时的，并使之可用重新获取数据！
        queryClient.invalidateQueries("posts");
      },
    });
  }


  const userMutation = useMutation(addWord, {
    'onSuccess': ({ data }) => { 
      console.log('success', data)
    },
  });

  const handleAddWord = (data, e) => {
    const formWord = new FormData();
    formWord.append('completed',data.completed)
    formWord.append('title',data.title)
    formWord.append('id',data.id)
    formWord.append('userId',data.userId)

    userMutation.mutate(formWord);  // 提交注册
  }
 
  console.log(data, 'data');
  const { data: words } = useQuery("posts", fetchWords, {});
  console.log('words?.data', words?.data[0].attributes.title)

  return (
    <>
    <button
      onClick={(e) => handleAddWord(data, e)}
      className='bg-slate-300 rounded-md border-2'
    >
      aa
    </button>

    <p> {words?.data[0].attributes.title}</p>
   </>
  );
}
export default ReactQueryTest
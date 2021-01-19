import { useEffect, useState } from 'react';
import './App.css';

/** 抓取我的 github repo 清單 */
function fetchMyRepo(cb) {
  /** 故意等一秒以呈現讀取時間 */
  setTimeout(function () {
    fetch("https://api.github.com/users/sasie59/repos")
      .then((result) => result.json())
      .then(cb)
      .catch((err) => console.log(err));
  }, 1000);
}

function App() {

  const [repoList, setRepoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    function fetchOnLock() {
      /** 先刪掉滑動方法，以防使用者繼續滑動call api */
      window.removeEventListener("scroll", handleScroll);
      fetchMyRepo((data) => {
        setRepoList(repoList => [...repoList, ...data]);
        setIsLoading(false);
        window.addEventListener("scroll", handleScroll, { passive: true });
      });
    }

    function handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setIsLoading(true);
        fetchOnLock();
      }
    }

    /** 設定滾動頁面時會觸發 handleScroll */
    window.addEventListener("scroll", handleScroll, { passive: true });

    fetchOnLock();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="App">
      {repoList.map((repo, i) =>
        <div className="repo" key={repo.id + i}>
          <div className="name">{repo.name}</div>
          <div className="desc">{repo.description}</div>
          <div className="url">{repo.url}</div>
        </div>
      )}
      {isLoading &&
        <div className="loading">讀取中</div>
      }
    </div>
  );
}

export default App;

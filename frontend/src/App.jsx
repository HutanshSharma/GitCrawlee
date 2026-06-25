import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate} from "react-router-dom"
import HomePage from './components/HomePage';
import Loading from './components/Loading';
import CursorLight from './components/CursorLight';
import './index.css';
import Search from './components/SearchComponent';

const Dashboard = lazy(() => import('./components/Dashboard'));
const RepoDetail = lazy(() => import('./components/RepoDetail'));

function ProtectedRoute({data, children}){
  if(!data){
    return <Navigate to='/' replace/>
  }
  return children
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isLoaded, setisLoaded] = useState(false)
  const [allrepos, setallrepos] = useState(null)
  const [prevPage, setPrevPage] = useState(null)

  useEffect(()=>{
    if(location.pathname == '/'){
      setallrepos(null)
      setisLoaded(false)
    }
  },[location.pathname])

  const handleUserSubmit = (formData) => {
    setUserData({
      profile: formData
    });
    navigate('/dashboard',{replace:true});
  };

  const handleRepoSelect = (repoName) => {
    (async function handler(){
      const { nickname } = userData.profile
      const urls = [
        `http://localhost:5000/repo/${nickname}/${repoName}`,
        `http://localhost:5000/pulls/${nickname}/${repoName}`,
        `http://localhost:5000/issues/${nickname}/${repoName}`,
        `http://localhost:5000/pulse/${nickname}/${repoName}`,
        `http://localhost:5000/commits/${nickname}/${repoName}`,
        `http://localhost:5000/repo-structure/${nickname}/${repoName}`,
      ];

      try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const results = await Promise.all(responses.map(res => res.json()));
        const data = {"repoData":{...results[0],'repoName':repoName},
                      "pulls":{...results[1]},
                      "issues":{...results[2]},
                      "pulse":{...results[3]},
                      "commits":{...results[4]},
                      "filesData":{...results[5]}
                    }
        setSelectedRepo(data)
        navigate(`/repo/${repoName}`,{replace:true})
      } catch (err) {
        console.error('Failed to load repository details', err)
        navigate('/dashboard',{replace:true})
      }
    })()
  };

  const handlereposearch = () => {
    (async function handler(){
      try {
        const response = await fetch(`http://localhost:5000/home/${userData.profile.nickname}`)
        const resData = await response.json()
        setallrepos(resData)
        setisLoaded(true)
        navigate('/repos',{replace:true})
      } catch (err) {
        console.error('Failed to load repositories', err)
        navigate('/dashboard',{replace:true})
      }
    })()
  }

  const handleBackToprevpage = () => {
    navigate(prevPage === 'search' ? '/repos' : '/dashboard');
  };

  const handleBackToHome = () => {
    navigate('/');
    setisLoaded(false)
    setUserData(null);
    setSelectedRepo(null);
  };

  return (
    <div className="min-h-screen text-gray-200">
      <div className="app-bg" aria-hidden="true" />
      <CursorLight />
      <div className="relative z-10">
        <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path='/' element={<HomePage onSubmit={handleUserSubmit}/>}/>
          <Route path="/loading" element={<Loading/>}/>
          <Route path="/dashboard"
          element={<ProtectedRoute data={userData}><Dashboard 
                    userData = {userData} 
                    onRepoSelect = {handleRepoSelect}
                    onBackToHome = {handleBackToHome}
                    isloaded = {isLoaded}
                    loadall = {handlereposearch}
                    setPrevPage = {setPrevPage}
                  /></ProtectedRoute>} />
          <Route path="/repos" 
          element={<ProtectedRoute data={allrepos}><Search repos = {allrepos}
                    onRepoSelect={handleRepoSelect}
                    onBack={()=>{
                      navigate('/dashboard')
                    }}
                    setPrevPage={setPrevPage}/></ProtectedRoute>}
                    />
          <Route path="/repo/:reponame"
          element={<ProtectedRoute data={selectedRepo}><RepoDetail
                    repo={selectedRepo} 
                    onBack={handleBackToprevpage}
                    prevPage = {prevPage}
                  /></ProtectedRoute>} />
        </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
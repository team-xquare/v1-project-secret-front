import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSecretCookie, resetSecretCookie } from '../util/cookie';

export const TableHeaderCell = ({ value }) => {
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {value}
    </th>
  );
};

export const TableDataCell = ({ value, link }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      {link ? <a href={link}>{value}</a> : value}
    </td>
  );
};

export const Checkbox = ({isChecked}) => {
  return (
    <>
      <input
        className="ml-[5px] transform scale-150"
        type="checkbox"
        checked={isChecked}
      />
    </>
  )
}

export const ProjectList = () => {

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([])
  const [progress, setProgress] = useState('')
  const [isProgressing, setIsProgressing] = useState(false)
  const [progressed, setProgressed] = useState([]);

  const [secret, setSecret] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    setSecret(getSecretCookie())
  }, []);

  useEffect(() => {
    const url = 'https://prod-server.xquare.app/project-secret-manager/project?secret=' + secret
    console.log(url)
    axios.get(url)
      .then((res) => {setData(res.data); setFetchError("")})
      .catch((err) => {
        setFetchError("권한이 없습니다")
      });
  }, [secret]);

  const regenerateProjectSecret = async () => {
    if (isProgressing) return;
    setIsProgressing(true)
    setProgress('발급중...')

    selected.forEach(async (it) => {
      const url = 'https://prod-server.xquare.app/project-secret-manager/project/' + it.id + '/access-key?secret=' + secret
      await axios.post(url)
        .then((res) => {
          setProgressed([...progressed, it]);
          if (progressed.length === selected.length) {
            setProgressed([]);
            setProgress('재발급 완료!')
            setIsProgressing(false)
          } 
        })
        .catch((err) => {
          setProgressed([]);
          setSelected([]);
          setProgress('재발급 실패 ' + err)
          setIsProgressing(false)
        });
    })

    setProgress('재발급 완료!')
    setIsProgressing(false)
  }

  const deleteProject = async () => {
    if (isProgressing) return;

    selected.forEach(async (it) => {

      setProgress('삭제중...')
      setIsProgressing(true)
      const url = 'https://prod-server.xquare.app/project-secret-manager/project/' + it.id + '?secret=' + secret
      await axios.delete(url)
        .then((res) => {
          setProgressed([...progressed, it]);
          if (progressed.length === selected.length) {
            setProgressed([]);
            setProgress('삭제 완료!')
            setIsProgressing(false)
          } 
        })
        .catch((err) => {
          setProgressed([]);
          setSelected([]);
          setProgress('삭제 실패 ' + err)
          setIsProgressing(false)
        });
    })
    
    setProgress('삭제 완료!')
    setIsProgressing(false)
    setData([])
  }

  const toggleSelect = async (item) => {
    if (isProgressing) return;
    selected.some((it) => it.id === item.id) ?
      setSelected(selected.filter(it => it.id !== item.id)) : setSelected([...selected, item])
  }

  const selectColor = (isSelected) => isSelected ? 'bg-blue-200' : 'bg-white'

  return (
    <div className="bg-gray-100 p-4">
      <h1 className="text-[20px] font-bold mb-4">등록된 프로젝트 목록 ({data.filter((item) => item.isApproved).length})</h1>
      <a href={"/admin/approve"}>
        <h1 className="text-[20px] text-slate-400 font-bold mb-4">요청된 프로젝트 목록 ({data.filter((item) => !item.isApproved).length})</h1>
      </a>
      <div>
        <div
          className="px-4 py-2 mt-6 w-fit outline outline-2 outline-blue-500 text-blue-500 rounded-md hover:outline-blue-800 hover:text-blue-800"
          onClick={() => setSelected([]) }
        >
          선택 초기화
        </div>
        <div className='absolute right-6 top-[90px] flex flex-row gap-[10px]'>
          <div className='w-fit px-4 py-2 mt-6 text-black rounded-md'>
            {progress}
          </div>
          <div
            className="w-fit px-4 py-2 mt-6 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            onClick={() => regenerateProjectSecret() }
          >
            재발급
          </div>
          <div
            className="w-fit px-4 py-2 mt-6 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:shadow-outline"
            onClick={() => deleteProject() }
          >
            삭제
          </div>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeaderCell value="이름" />
            <TableHeaderCell value="영어이름" />
            <TableHeaderCell value="레포지토리" />
            <TableHeaderCell value="타입" />
            <TableHeaderCell value="생성일" />
            <TableHeaderCell value="최종배포일" />
            <TableHeaderCell value="최종배포성공여부" />
            <TableHeaderCell value="팀" />
            <TableHeaderCell value="레디스 사용" />
            <TableHeaderCell value="MySQL 사용" />
            <TableHeaderCell value="담당자 이메일" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data
            .filter((item) => item.isApproved)
            .map((item) => 
              <tr 
                className={selectColor(selected.some((it) => it.id === item.id))}
                key={item.id}
                onClick={() => toggleSelect(item)}
              >
                <TableDataCell value={item.nameKo} />
                <TableDataCell value={item.nameEn} />
                <TableDataCell value={item.repository} link={"https://github.com/" + item.repository} />
                <TableDataCell value={item.type} />
                <TableDataCell value={item.createAt} />
                <TableDataCell value={item.lastUsedAt} />
                <TableDataCell value={<Checkbox isChecked={item.lastRequestSucceed}/>}/>
                <TableDataCell value={item.team} />
                <TableDataCell value={<Checkbox isChecked={item.useRedis}/>}/>
                <TableDataCell value={<Checkbox isChecked={item.useMysql}/>}/>
                <TableDataCell value={item.email} />
              </tr>
            )
          }
        </tbody>
      </table>
      {fetchError && <>{fetchError}</>}
      <div onClick={() => resetSecretCookie()}>
        로그아웃
      </div>
    </div>
  );
}

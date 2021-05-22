import React, { createContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import queryString from 'query-string';

export const HandleContext = createContext();

const baseURL = `https://js-server-student-list.herokuapp.com/api`;

const HandleContextProvider = ({ children }) => {
  const [getStudent, setGetStudent] = useState('');
  const [pagination, setPagination] = useState({
    _page: 1,
    _limit: 1,
    _totalRows: 20
  });

  const [filter, setFilter] = useState({
    _page: 1,
    _limit: 10,
  });

  // ===== GET STUDENTs =============================
  useEffect(() => {
    const fetchStudentLists = async () => {
      try {
        const paramString = queryString.stringify(filter)
        const reponse = await axios.get(`${baseURL}/student?${paramString}`);
        const { data, pagination } = reponse.data;

        setGetStudent(data);
        setPagination(pagination);

      } catch (error) { alert(error.message) }
    };

    fetchStudentLists();
  }, [filter]);

  const handlePageChange = (newPage) => {
    setFilter({
      ...filter,
      _page: newPage,
    })
  };

  // ===== ADD NEW STUDENT =================================================
  const [name, setName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [classID, setClassID] = useState('');
  const [gender, setGender] = useState('');
  const [dayOfBirth, setDayOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  const titles = [name, studentID, classID, gender, dayOfBirth, phoneNumber, email, avatar];
  const setTitles = [setName, setStudentID, setClassID, setGender, setDayOfBirth, setPhoneNumber, setEmail, setAvatar];

  const handleChangeTitle = e => {
    const IdTitle = e.target.parentNode.id;
    const value = e.target.value;

    switch (IdTitle) {
      case 'name':
        setTitles[0](value);
        break;
      case 'studentID':
        setTitles[1](value);
        break;
      case 'classID':
        setTitles[2](value);
        break;
      case 'gender':
        setTitles[3](value);
        break;
      case 'dayOfBirth':
        setTitles[4](value);
        break;
      case 'phoneNumber':
        setTitles[5](value);
        break;
      case 'email':
        setTitles[6](value);
        break;
      case 'avatar':
        setTitles[7](value);
        break;
      default: return;
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${baseURL}/student`, {
        'name': titles[0],
        'studentID': titles[1],
        'classID': titles[2],
        'gender': titles[3],
        'dayOfBirth': titles[4],
        'phoneNumber': titles[5],
        'email': titles[6],
        'avatar': titles[7],
      });
      setTitles.map(setTitle => setTitle(''));
      setFilter({ ...filter });
    } catch (error) { alert(error.message) }
  };

  // ===== VIEW STUDENT =====================
  const getViewStudent = async ID => {
    try {
      const reponse = await axios.get(`${baseURL}/student/${ID}`);
      const reponseData = reponse.data;

      setName(reponseData.name);
      setStudentID(reponseData.studentID);
      setClassID(reponseData.classID);
      setGender(reponseData.gender);
      setPhoneNumber(reponseData.phoneNumber);
      setEmail(reponseData.email);
      setAvatar(reponseData.avatar)
      setDayOfBirth(reponseData.dayOfBirth);


    } catch (error) { alert(error.message) }
  };

  // ==== SEARCH STUDENT ======================
  const searchName = value => {
    setFilter({
      ...filter,
      _page: 1,
      name_like: value,
    })
  };

  const searchID = value => {
    setFilter({
      ...filter,
      _page: 1,
      studentID_like: value,
    })
  };

  const searchClassID = value => {
    setFilter({
      ...filter,
      _page: 1,
      classID_like: value
    })
  };

  // ==== DELETE STUDENT ===============
  const totalsDeleteIDs = useRef(0);
  const deleteIDsList = useRef([]);

  const sendDeleteIDs = ID => {
    if (deleteIDsList.current.includes(ID)) {
      const index = deleteIDsList.current.indexOf(ID);
      deleteIDsList.current.splice(index, 1);
      totalsDeleteIDs.current--;
    } else {
      deleteIDsList.current.push(ID);
      totalsDeleteIDs.current++;
    };
  };

  const deleteMultiStudent = () => {
    const result = window.confirm(`Do you want to delete ${deleteIDsList.current.length} students?`);
    if (!result) return;
    deleteIDsList.current.forEach(id => handleDeleteStudent(id));
    totalsDeleteIDs.current = 0;
  };

  const handleDeleteStudent = async ID => {
    try {
      await axios.delete(`${baseURL}/student/${ID}`);
      setFilter({ ...filter });
    } catch (error) { alert(error.message) };
  };

  // ==== UPDATE STUDENT ===============
  const handleUpdate = async id => {
    try {
      await axios.patch(`${baseURL}/student/${id}`, {
        'name': titles[0],
        'studentID': titles[1],
        'classID': titles[2],
        'gender': titles[3],
        'dayOfBirth': titles[4],
        'phoneNumber': titles[5],
        'email': titles[6],
        'avatar': titles[7],
      })
      setFilter({ ...filter })
    } catch (error) { alert(error.message) }
  };



  const handleContextData = {
    // ===== GET STUDENT LIST ===============
    getStudent,

    // ===== PAGINATION =====================
    pagination,
    handlePageChange,

    // ===== ADD NEW STUDENTs ===============
    titles,
    setTitles,
    handleChangeTitle,
    handleSubmit,

    // ===== VIEW STUDENT ===================
    getViewStudent,

    // ===== SEARCH STUDENT =================
    searchName,
    searchID,
    searchClassID,

    // ===== DELETE STUDENT =================
    sendDeleteIDs,
    totalsDeleteIDs,
    deleteMultiStudent,

    // ===== UPDATE STUDENT =================
    handleUpdate,

  };

  return (
    <HandleContext.Provider value={handleContextData}>
      {children}
    </HandleContext.Provider>
  )
};

export default HandleContextProvider;
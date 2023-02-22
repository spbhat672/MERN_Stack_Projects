import React, { useRef,useState,useEffect } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import axios from 'axios';

function Home() {
  const searchInputRef = useRef(null);
  const [userData,setUserData] = useState([]);
  const [genderData,setGenderData] = useState([]);

  // fetch all the users
  const getAllUsers = async ()=>{
    try{         
         const {data} = await axios.get('http://localhost:8080/api/users/get-user');
         setUserData(data); 
         console.log(data);        
    }catch(err){      
      console.log(err);
    }
  }

   // fetch the genders
   const getGenderData = async ()=>{
    try{         
         const {data} = await axios.get('http://localhost:8080/api/genders/get-gender');
         setGenderData(data); 
         console.log(data);        
    }catch(err){      
      console.log(err);
    }
  }

  useEffect(()=>{
    getAllUsers();
    getGenderData();
  },[])


  const getColumnSearchProps = (dataIndex, customFilterIcon) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={confirm}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) =>
      customFilterIcon || <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInputRef.current.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Image',
      dataIndex: 'photocopy',
      key: 'photocopy',
      render:(image,record)=><img src={image} alt={record.name} height="60" width="60"/>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Contact No.',
      dataIndex: 'contact',
      key: 'contact',
      ...getColumnSearchProps('contact'),
      sorter: (a, b) => a.contact - b.contact,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: genderData,
      onFilter: (value, record) => record.gender.indexOf(value) === 0,
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      sortDirections: ['ascend', 'descend'],
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address'),
      sorter: (a, b) => a.address.localeCompare(b.address),
      sortDirections: ['ascend', 'descend'],
    },
  ];

return (
  <Table
    columns={columns}
    dataSource={userData}
    onRow={(record, rowIndex) => {
      return {
        onClick: () => {
          console.log(record, rowIndex);
        },
      };
    }}
  />
);
}

export default Home;


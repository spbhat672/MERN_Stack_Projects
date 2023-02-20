import React, { useState,useRef } from 'react';
import { Table, Input, Button, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Space } from 'antd';

const { Option } = Select;

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    gender: 'male',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    gender: 'male',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    gender: 'male',
  },
  {
    key: '4',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    gender: 'female',
  },
];

function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const searchInputRef = useRef(null);


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
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter searchWords={[searchText]} autoEscape textToHighlight={text} />
      ) : (
        text
      ),
  });
  

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn('');
    setSelectedGender('');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) =>
        searchedColumn === 'name' ? (
          <Highlighter searchWords={[searchText]} autoEscape textToHighlight={text} />
        ) : (
          text
        ),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      ...getColumnSearchProps('age'),
      sorter: (a, b) => a.age - b.age,
      sortDirections: ['descend', 'ascend'],
      render: (text) =>
        searchedColumn === 'age' ? (
          <Highlighter searchWords={[searchText]} autoEscape textToHighlight={text.toString()} />
        ) : (
          text
        ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
      onFilter: (value, record) => record.gender.indexOf(value) === 0,
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      sortDirections: ['ascend', 'descend'],
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      render: (text) =>
        searchedColumn === 'gender' ? (
          <Highlighter searchWords={[searchText]} autoEscape textToHighlight={text} />
        ) : (
          text
        ),
    },
  ];
  
  
  

return (
  <Table
    columns={columns}
    dataSource={data}
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


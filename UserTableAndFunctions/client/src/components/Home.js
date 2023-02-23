import React, { useRef,useState,useEffect } from 'react';
import { Table, Input, Button  } from 'antd';
import { SearchOutlined,EditOutlined,DeleteOutlined } from '@ant-design/icons';
import { Space,message,Modal,Form,Select } from 'antd';
import axios from 'axios';
import XLSX from 'xlsx'

function Home() {
  const searchInputRef = useRef(null);
  const [userData,setUserData] = useState([]);
  const [genderData,setGenderData] = useState([]);
  const [popupModal,setPopupModal] = useState(false);
  const [editUser,setEditUser] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const fileInputRef = useRef(null);
  const excelFileInputRef = useRef(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteingRecord,setDeleteingRecord] = useState(null);
  const EXTENSIONS = ['xlsx', 'xls', 'csv'];
  const [filteredData, setFilteredData] = useState(userData);

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

  //handle delete
  const handleDelete = async () =>{
    try{      
      await axios.post("http://localhost:8080/api/users/delete-user",{_id:deleteingRecord._id});
      message.success("User deleted successfully");
      setPopupModal(false);
      getAllUsers();
      setDeleteingRecord(null);
    }catch(error){
      message.error("Something went wrong");
      console.log(error);
    }
  }

  // handle form submit
  const handleSubmit= async (value)=>{
    if(editUser===null){
      try{
        await axios.post("http://localhost:8080/api/users/add-user", {...value,photocopy:base64Image});
        message.success("user Added Successfully");
        setPopupModal(false);
        setBase64Image("");
        getAllUsers();
        setEditUser(null);
       }catch(error){
        message.error("Something went wrong");
        console.log(error);
       }
    }else{
      try{
        await axios.put("http://localhost:8080/api/users/edit-user", {...value,photocopy:base64Image,_id:editUser._id});
        message.success("User Updated Successfully");
        setPopupModal(false);
        setBase64Image("");
        getAllUsers();
        setEditUser(null);
       }catch(error){
        message.error("Something went wrong");
        console.log(error);
       }
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
     setBase64Image(reader.result);     
   };
  }

  const handleClear = () => {
    setBase64Image(null);
    fileInputRef.current.value = null;
  };

  const handleDeleteConfirm = () => {
    handleDelete();
    setIsDeleteModalVisible(false);
  }

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  }

  const downloadExcel=()=>{
    let data;
    if(filteredData == null || filteredData.length===0){
   console.log("not filtered");
   data=userData;
    }
        
    else 
        data = filteredData;
    const newData=data.map(row=>{
      const { photocopy,__v, ...rest } = row; 
      delete rest.tableData; 
      return rest;
    })
    const workSheet=XLSX.utils.json_to_sheet(newData);
    const workBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook,workSheet,"Users");
    //Buffer
    let buf=XLSX.write(workBook,{bookType:"xlsx",type:"buffer"});
    //Binary string
    XLSX.write(workBook,{bookType:"xlsx",type:"binary"});
    //Download
    XLSX.writeFile(workBook,"UserData.xlsx");
  }

  const getExention = (file) => {
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    return EXTENSIONS.includes(extension) // return boolean
  }

  const convertToJson = (headers, data) => {
    const rows = []
    const genderValue = genderData.map(v => v.value);
    for (const row of data) {
      let rowData = {};
      for (let i = 0; i < headers.length; i++) {
        const element = row[i];
  
        if (headers[i] === "gender" && !genderValue.includes(element)) {
          message.error("invalid gender value");
          return; // exit function
        }
  
        rowData[headers[i]] = element;
      }
      rows.push(rowData);
    }
    console.log("rooooows "+rows)
    return rows
  }

  const saveExcelData = async(data)=>{
    try{
      console.log("hello  excel data "+data);
      await axios.post("http://localhost:8080/api/users/add-user", {...data,photocopy:""});
      message.success("user Added Successfully");
      getAllUsers();
     }catch(error){
      message.error("Something went wrong");
      console.log(error);
     }
  }
  
  const importExcel = (e) => {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = (event) => {
      //parse data

      const bstr = event.target.result
      const workBook = XLSX.read(bstr, { type: "binary" })

      //get first sheet
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
      // console.log(fileData)
      const headers = fileData[0]
      const heads = headers.map(head => ({ title: head, field: head }))

      //removing header
      fileData.splice(0, 1)

      let importData = convertToJson(headers, fileData);
      if(importData===undefined|| importData===null){
        message.warning("No data is imported");
      }else 
      {
        importData.forEach((data)=>{
          saveExcelData(data);
        })        
        getAllUsers();
      }
      excelFileInputRef.current.value = null; 
    }

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file)   ;             
      }
      else {
        alert("Invalid file input, Select Excel, CSV file")
      }
    }
  }

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

  const handleTableChange = (pagination, filters, sorter) => {
    // Apply filters to the data
    const filteredData = userData.filter((record) => {
      // Check each column filter
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true; // Skip if no filter is set for this column
        if (!filters[key].length) return true; // Skip if no filter value is set
        return filters[key].some((value) => record[key].toString() === value);
      });
    });
  
    // Sort the filtered data if a sorter is present
    if (sorter.field) {
      const order = sorter.order === 'descend' ? -1 : 1;
      filteredData.sort((a, b) => {
        if (a[sorter.field] < b[sorter.field]) return -1 * order;
        if (a[sorter.field] > b[sorter.field]) return 1 * order;
        return 0;
      });
    }
  
    // Update the state with the filtered and sorted data
    setFilteredData(filteredData);
  };
  
  
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
      ellipsis: false, // disable ellipsis: to wrap the text
      width:400,
    },
    {title:'Actions',dataIndex:"_id",render:(id,record)=>(<div>
      <EditOutlined style={{cursor:'pointer'}} onClick={()=>{
        setEditUser(record);
        setBase64Image(record.photocopy);
        setPopupModal(true);
      }}/>
      <DeleteOutlined style={{cursor:'pointer'}} onClick={()=>{
        setDeleteingRecord(record);
        handleDeleteClick();
      }}/>      
    </div>)}
  ];

return (
  <div>
    <Button type="primary" onClick={()=> setPopupModal(true)}>Add Item</Button>
    <Button type="primary" onClick={()=> downloadExcel()}>Export Excel</Button>
    <input type="file" onChange={importExcel} ref={excelFileInputRef}/>
    <Table
    columns={columns}
    dataSource={userData}
    pagination={{
      pageSize: 10, // display 10 records per page
    }}
    onChange={handleTableChange}
    onRow={(record, rowIndex) => {
      return {
        onClick: () => {
          console.log(record, rowIndex);
        },
      };
    }}
  />
  {
              popupModal && (
                <Modal title={`${editUser !==null ? 'Edit Item':'Add New Item'}`} visible={popupModal} 
                      onCancel={()=>{setEditUser(null); setPopupModal(false);handleClear();}} footer={false}>
                 <Form initialValues={editUser} onFinish={handleSubmit}>
                 <Form.Item name="photocopy" label="Photo">
                   <input 
                    type="file"
                    label="Image"
                    name="myFile"
                    id='file-upload'
                    accept='.jpeg, .png, .jpg'
                    onChange={(e) => handleImageUpload(e)}
                    ref={fileInputRef}
                    style={{marginBottom:"5px"}}
                  />
                  {base64Image && <img src={base64Image} alt="Uploaded Pic" style={{ width: '50px', height: '50px' }}/>}
                  {base64Image && <button type="button" style={{marginLeft:"2px"}} onClick={handleClear}>Clear</button>}
                </Form.Item>
                    <Form.Item name="name" label="Name">
                      <Input/>
                    </Form.Item>
                    <Form.Item name="contact" label="Contact No.">
                      <Input/>
                    </Form.Item>
                    <Form.Item name="gender" label="Gender">
                       <Select>
                          {genderData.map((gender) => (
                            <Select.Option key={gender.value} value={gender.value}>
                              {gender.text}
                            </Select.Option>
                          ))}
                        </Select>
                    </Form.Item>  
                    <Form.Item name="address" label="Address">
                      <Input/>
                    </Form.Item>                  
                    <div className='d-flex justify-content-end'>
                      <Button type="primary" htmlType='submit'>Save</Button>
                    </div>
                 </Form>
            </Modal>
              )
            }
            <Modal
              title="Confirm Delete"
              visible={isDeleteModalVisible}
              onOk={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            >
              <p>Are you sure you want to delete?</p>
            </Modal>
  </div>  
  
);
}

export default Home;


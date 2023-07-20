import { Fragment, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Modal, Table, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { request } from "../server/request";

const { confirm } = Modal;

const TeachersP = () => {
  const columns = [
    {
      title: "First name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Image",
      dataIndex: "avatar",
      key: "avatar",
      render: (item) => <img height={50} src={item} alt={item} />,
    },
    {
      title: "Groups",
      dataIndex: "groups",
      key: "groups",
      render: (groups) => (
        <Fragment>
          {groups.length !== 0
            ? groups.map((gr) => <Tag key={gr}>{gr}</Tag>)
            : "No"}
        </Fragment>
      ),
    },
    {
      title: "Ismarried",
      dataIndex: "isMarried",
      key: "isMarried",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <Fragment>
          <Button
            onClick={() => editTeacher(item.id)}
            type="primary"
            icon={<EditOutlined />}
          />
          <Button
            onClick={() => deleteTeacher(item.id)}
            type="primary"
            danger
            icon={<DeleteOutlined />}
          />
        </Fragment>
      ),
    },
  ];
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();

  const getTeachers = async () => {
    setLoading(true);
    try {
      let { data } = await request.get("teacher");
      data = data.map((el) => ({ ...el, key: el.id }));
      setTeachers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
  };

  const submit = async () => {
    try {
      let values = await form.validateFields();
      if (selected) {
        await request.put(`teacher/${selected}`, values);
      } else {
        await request.post("teacher", values);
      }
      form.resetFields();
      hideModal();
      getTeachers();
    } catch (err) {
      console.log(err);
    }
  };

  async function editTeacher(id) {
    let { data } = await request.get(`teacher/${id}`);
    console.log(data);
    form.setFieldsValue(data);
    setSelected(id);
    showModal();
  }

  const addTeacher = () => {
    showModal();
    setSelected(null);
  };

  function deleteTeacher(id) {
    confirm({
      title: "Do you Want to delete this teacher?",
      icon: <ExclamationCircleFilled />,
      onOk: async () => {
        await request.delete(`teacher/${id}`);
        getTeachers();
      },
    });
  }

  return (
    <Fragment>
      <Table
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <Input />
            <Button onClick={addTeacher} type="primary">
              Add
            </Button>
          </div>
        )}
        loading={loading}
        columns={columns}
        dataSource={teachers}
      />
      <Modal
        title="Adding teacher"
        open={isModalOpen}
        onOk={submit}
        okText={selected ? "Save" : "Add"}
        onCancel={hideModal}
      >
        <Form
          initialValues={{
            isMarried: false,
          }}
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="firstName"
            label="First name"
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
            ]}
            name="lastName"
            label="Last name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
              { type: "url", warningOnly: true },
              { type: "string", min: 6 },
            ]}
            name="avatar"
            label="Image"
          >
            <Input />
          </Form.Item>
          <Form.Item valuePropName="checked" name="isMarried">
            <Checkbox>Is married ?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default TeachersP;

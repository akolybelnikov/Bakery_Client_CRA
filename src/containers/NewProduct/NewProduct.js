import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Icon, Input, Upload, Button, Select, Row, Col, notification, Breadcrumb } from 'antd';
import config from "../../config";
import styled from 'styled-components';
import LoaderButton from "../../components/LoaderButton";
import { invokeApig, s3Upload } from "../../libs/awsLib";
import "./NewProduct.css";

const FormItem = Form.Item;   
const {TextArea} = Input;
const Option = Select.Option;

const BreadCrumbs = styled(Row)`
    margin-top: 50px;
`;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class NewProduct extends Component {
    constructor(props) {
        super(props);

        this.file = null;
        
        this.state = {
            uploading: false,
            loading: false,
            previewImage: '',
            src: '',
            err: null
        };
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = async e => {
        e.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert("Размер изображения не должен превышать 5МБ");
            return;
        }

        this.setState({ loading: true });

        try {
            const uploadedFileLocation = this.file ? (await s3Upload(this.file)).Location : null;
            const uploadedFileName = uploadedFileLocation.split('/')[3];
            await this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.createProduct({
                        category: values['category'],
                        productname: values['name'],
                        content: values['content'],
                        productsort: values['sort'],
                        price: values['price'],
                        weight: values['weight'],
                        attachment: uploadedFileLocation,
                        image: uploadedFileName
                    });
                }
            });
            this.openNotification();
            this.props.history.push("/admin");

        } catch (e) {
            alert("Ошибка при загрузке изображения. Продукт не создан.");
            this.setState({ loading: false });
        } 

        this.props.form.resetFields();        
        this.props.form.validateFields();
    }

    handleCancel = () => {
        this.file = null;
        this.setState({ previewImage: '' });
    }


    createProduct(product) {
        return invokeApig({
            path: "/products",
            method: "POST",
            body: product
        });
    }

    openNotification = () => {
        notification.open({
          message: 'Всё прошло успешно!',
          description: 'Загрузка завершена.',
          icon: <Icon type="smile-circle" style={{ color: "#52082D" }} />,
        });
    };

    render() {
        const { previewImage } = this.state;
        const props = {
            beforeUpload: (file) => {
                this.file = file;
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    this.setState({
                        previewImage: [reader.result]
                    })
                  }.bind(this);
                return false;
            }
        }
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Show errors only if a field was touched.
        const categoryError = isFieldTouched('category') && getFieldError('category');
        const nameError = isFieldTouched('name') && getFieldError('name');
        const contentError = isFieldTouched('content') && getFieldError('content');
        const sortError = isFieldTouched('sort') && getFieldError('sort');
        const priceError = isFieldTouched('price') && getFieldError('price');
        const weightError = isFieldTouched('weight') && getFieldError('weight');
        return (
            <div style={{height: '100vh'}}>
                <Row className="is-hidden-tablet" style={{marginTop: "25px"}}><Icon onClick={this.props.history.goBack} className="icon-back" type="left" /></Row>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/admin">Управление</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to='#' className="active-link">Создать новый продукт</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <Row style={{margin: '15px 0'}}>
                    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 18, offset: 3 }} md={{ span: 16, offset: 4 }} >
                        <div className="Form">
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem validateStatus={categoryError ? 'error' : ''} help={categoryError || ''}>
                                    {getFieldDecorator('category', {
                                        rules: [{ required: true, message: 'Выберите категорию продукта' }],
                                    })(
                                        <Select placeholder="Категория">
                                        <Option value="bread">Хлеб и булки</Option>
                                        <Option value="coffee">Кофе и другие напитки</Option>
                                        <Option value="cakes">Кондитерские изделия</Option>
                                        <Option value="order">Торты на заказ</Option>
                                    </Select>
                                    )}
                                </FormItem>
                                <FormItem validateStatus={nameError ? 'error' : ''} help={nameError || ''}>
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: 'Внесите название продукта' }],
                                    })(
                                        <Input type="string" placeholder="Название продукта" />
                                    )}
                                </FormItem>
                                <FormItem validateStatus={contentError ? 'error' : ''} help={contentError || ''}>
                                    {getFieldDecorator('content', {
                                        rules: [{ required: true, message: 'Внесите описание продукта' }],
                                    })(
                                        <TextArea type="string" rows={4} placeholder="Описание продукта" />
                                    )}
                                </FormItem>
                                <FormItem validateStatus={sortError ? 'error' : ''} help={sortError || ''}>
                                    {getFieldDecorator('sort', {
                                        rules: [{ required: false }],
                                    })(
                                        <TextArea type="string" rows={4} placeholder="Начинки / сорта продукта: вводить через точку-запятую (;) (!)" />
                                    )}
                                </FormItem>
                                <FormItem validateStatus={priceError ? 'error' : ''} help={priceError || ''}>
                                    {getFieldDecorator('price', {
                                        rules: [{ required: true, message: 'Внесите цену продукта' }],
                                    })(
                                        <Input type="string" placeholder="Цена продукта: 00.00" />
                                    )}
                                </FormItem>
                                <FormItem validateStatus={weightError ? 'error' : ''} help={weightError || ''}>
                                    {getFieldDecorator('weight', {
                                        rules: [{ required: true, message: 'Внесите вес продукта' }],
                                    })(
                                        <Input type="string" placeholder="Вес продукта: 130гр. / 150 мл." />
                                    )}
                                </FormItem>
                                <figure>
                                    <img style={{maxWidth: '100%'}} alt="" src={previewImage} />
                                </figure>
                                <FormItem >
                                    <Upload onRemove={this.handleCancel} {...props}>
                                        <Button className="button is-info is-outlined"><Icon type="upload" />Выбрать изображение</Button>
                                    </Upload>
                                </FormItem>
                                <FormItem>
                                    <LoaderButton type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Создать продукт" loadingText="Идёт загрузка ..." />
                                </FormItem>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Form.create()(NewProduct);
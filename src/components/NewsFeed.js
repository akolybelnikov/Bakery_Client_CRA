import React, { Component } from "react";
import config from "../config";
import { Row, Col, Card, Carousel, Spin, Icon } from 'antd';
import ProgressiveImage from 'react-progressive-bg-image';
import { invokeOpenApi } from "../libs/awsLib";
import styled from 'styled-components';
import Responsive from 'react-responsive';

const logoImg = require(`../public/logo.png`);

const NewsImage = styled(ProgressiveImage)`
  background-size: contain;
  background-position: center;
  min-width: 200px;
  min-height: 200px;
  @media only screen and (max-width: 480px) {
    min-width: 75px;
    min-height: 75px;
  }
  @media only screen and (min-width: 481px) and (max-width: 767px) {
    min-width: 125px;
    min-height: 125px;
  }
`

const CarouselCard = styled(Card)`
  .ant-card-head:hover {
    background: rgba(234,204,178,.5);
  }
  .ant-card-actions {
    background: #52082D;
    li > span i {
      margin-right: 5px;
    }

    li > span a {
      color: white;
    }

    li > span a:hover {
      color: white;
    }

    @media screen and (max-width: 480px) {
      .slick-list {
        height: 125px;
      }
    }
    
    @media screen and (min-width: 768px) {
      li > span a {
        font-size: 18px;
        color: rgba(234,204,178,1);
      }
      .slick-list {
        height: 250px;
      }
    }
  }
`

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

export default class NewsFeed extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          news: [],
          isLoading: true
        }
    }

    async componentDidMount() {

        try {
    
          const news = [];
          const fetchedNews = await this.getNews();
          this.sortByDate(fetchedNews).reverse();
          for (let i = 0; i < 5; i++) {
            if (fetchedNews[i] !== undefined) {
              news.push(fetchedNews[i]);
            }
          }
          this.setState({ 
            news: news,
            isLoading: false
          });
    
        } catch (e) {
          console.log(e);
        }
    }

    getNews() {
        return invokeOpenApi({ path: "/news"});
    }

    sortByDate(array) {
      return array.sort((a, b) => a.createdAt - b.createdAt);
    }

    renderNews(news) {
        if (this.state.news) 
          return news.map(
            (newsitem) => 
              <a key={newsitem.newsId} href='/news'>
                <Row style={{marginRight: '20px'}}>  
                  <Col xs={6}>
                    <Card 
                      bordered={false} 
                      cover={<NewsImage src={`${config.s3.URL}/200x200/${newsitem.image}`} placeholder={logoImg} transition="all 1s linear" crossOrigin='anonymous'/>}>
                    </Card>
                  </Col>
                  <Col xs={{ span: 16, offset: 2 }} sm={{ span: 17, offset: 1 }}>
                    <Card 
                      className='news-card' 
                      bordered={false}>
                        <p className='is-size-7-mobile is-size-5-tablet news-text' style={{textAlign: "center"}}>
                          <Mobile>{newsitem.content.substring(0, 200)} ... </Mobile>
                          <Tablet>{newsitem.content.substring(0, 275)} ... </Tablet>
                          <Desktop>{newsitem.content.substring(0, 350)} ... </Desktop>
                        </p>
                    </Card>
                  </Col>
                </Row>
              </a>
        )
    }

    render() {
        return (
            <div style={{marginTop: "25px", marginBottom: "35px", background: "rgba(234,204,178,.5)", padding: ".7rem"}}>
                <CarouselCard 
                  style={{cursor: "pointer"}} title="Наши новости" bordered="false"
                  actions={[<a href="/news" className="news-button"><Icon type="select" />Посмотреть все новости</a>]}>            
                    <Carousel autoplaySpeed={10000} autoplay>
                        {this.state.news ? this.renderNews(this.state.news) : <Spin style={{display: 'block'}} size="small" />}
                    </Carousel>           
                </CarouselCard>
            </div> 
        )
    }

}
// About.js
import React from "react";
import { Layout, Card, Row, Col, Typography, List, Avatar } from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";
import ResponsiveNavBar from "../components/Navbar";
import "./About.css"; // Import the CSS file for styling

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const features = [
  {
    title: "Login for Everything",
    description: "Access all features with a single login.",
    icon: "🔐",
  },
  {
    title: "Track Your Lecture Count",
    description:
      "Monitor your attendance for achieving 75% or your desired goal.",
    icon: "📚",
  },
  {
    title: "Multipurpose Dashboard",
    description: "An all-in-one dashboard to manage your academic activities.",
    icon: "🖥️",
  },
  {
    title: "Timetable at Your Fingertips",
    description: "Quickly view your class schedule anytime, anywhere.",
    icon: "📅",
  },
  {
    title: "Attendance Brief",
    description: "Detailed subject-wise attendance reports.",
    icon: "📈",
  },
  {
    title: "Quiz Results",
    description: "View and analyze your quiz performance.",
    icon: "🏆",
  },
  {
    title: "Change Quiz PIN",
    description: "Securely update your quiz PIN as needed.",
    icon: "🔄",
  },
  {
    title: "Change Password",
    description: "Easily update your account password.",
    icon: "🔑",
  },
  {
    title: "Direct Quiz Access",
    description:
      "Attempt quizzes directly with synchronized questions for all users. [BETA]",
    icon: "🚀",
  },
  {
    title: "More Features Coming Soon",
    description: "Stay tuned for more exciting updates!",
    icon: "✨",
  },
];

const About = () => {
  return (
    <>
      <ResponsiveNavBar />
      <Layout className="about-layout">
        <Content className="about-content">
          <Card className="about-card">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={12}>
                <div className="profile-section">
                  <Avatar
                    size={120}
                    src="https://avatars.githubusercontent.com/u/59335027?v=4"
                    alt="Amit"
                  />
                  <Title level={2} className="developer-name">
                    Amit Yadav
                  </Title>
                  <Text className="developer-role">Software Developer</Text>
                  <Text className="developer-college">ABES @ DS_3A</Text>
                  <div className="social-icons">
                    <a
                      href="https://github.com/starlordamit"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubOutlined />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/amit-yadav-710408253/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinOutlined />
                    </a>
                    <a
                      href="https://www.instagram.com/i.am.amit.yadav/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <InstagramOutlined />
                    </a>
                    <a href="mailto:amit@creatorsmela.com">
                      <MailOutlined />
                    </a>
                  </div>
                </div>
                <div className="slogan-section">
                  <svg viewBox="0 0 800 200" className="slogan-svg">
                    <defs>
                      <path
                        id="curve"
                        d="M50,150 Q400,50 750,150"
                        fill="transparent"
                      />
                    </defs>
                    <text width="800">
                      <textPath
                        href="#curve"
                        startOffset="50%"
                        textAnchor="middle"
                        className="slogan-text"
                      >
                        Where I venture, others soon follow.
                      </textPath>
                    </text>
                  </svg>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="features-section">
                  <Title level={3} className="features-title">
                    Features of AIMS 2.0
                  </Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={features}
                    split={true}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <div className="feature-icon">{item.icon}</div>
                          }
                          title={<Text strong>{item.title}</Text>}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
    </>
  );
};

export default About;

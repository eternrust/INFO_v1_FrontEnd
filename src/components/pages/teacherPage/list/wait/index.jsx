/* eslint-disable react/jsx-no-undef */
import styled from "styled-components";
import { Notice } from "../../../../common/notice";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCallback } from "react";
import { postNotice, postNoticeRequest } from "../../../../api/teacher";
import LoadingPage from "../../../../common/loading";
import ErrorPage from "../../../../common/error";
const Wait = ({ path }) => {
  const [count, setCount] = useState(0);
  const [arr, setArr] = useState([]);
  const queryClient = useQueryClient();
  const { status, data } = postNotice(count, path);

  useEffect(() => {
    if (data?.totalPage > 5) {
      if (data.totalPage % 5 !== 0) {
        if (parseInt(count / 5) === parseInt(data.totalPage / 5)) {
          const asd = parseInt(data.totalPage % 5);
          let aq = new Array(5).fill(0);
          for (let i = 0; i < 5; i++) {
            if (i < asd) {
              aq[i] = 5 * asd + 1 + i;
            } else {
              aq[i] = "•";
            }
          }
          setArr(aq);
        }
      }
      if (count % 5 === 0 && count / 5 < data.totalPage / 5 - 1) {
        setArr([count + 1, count + 2, count + 3, count + 4, count + 5]);
      } else if (count % 5 === 4) {
        setArr([count - 3, count - 2, count - 1, count, count + 1]);
      }
    }
  }, [count, data?.totalPage]);
  useEffect(() => {
    if (data?.last && data.totalPage > count) {
      queryClient.prefetchQuery(["pagin", count + 1, path], () =>
        postNoticeRequest(count + 1, path)
      );
    }
  }, [data, count, queryClient]);
  const Click = useCallback((e) => {
    setCount(e);
  }, []);
  return (
    <>
      {status === "loading" ? (
        <LoadingPage />
      ) : status === "error" ? (
        <ErrorPage />
      ) : (
        <>
          <Table>
            <Ulbox>
              {data.count.map((user, i) => (
                <Libox>
                  <Box>
                    <Category>
                      <div>{user.name}</div>
                      <div>{data.ad[i]}</div>
                      <div>{data.as[i]}</div>
                    </Category>
                    <Category>
                      <div>채용인원</div>
                      <div>{user.total}명</div>
                    </Category>
                    <ButtonProps>
                      <div>자세히 보기</div>
                      <div>지원자 리스트</div>
                    </ButtonProps>
                  </Box>
                </Libox>
              ))}
            </Ulbox>
            <Ul top={100 * (7 - data.count.length) + 50}>
              <Li>
                <Button onClick={() => setCount(0)}>First Page</Button>
              </Li>
              <Li>
                <Text
                  onClick={() => {
                    if (count > 4) {
                      setCount((parseInt(count / 5) - 1) * 5 + 4);
                    }
                  }}
                >
                  &lt;
                </Text>
              </Li>
              {arr.map((item) => (
                <Li id={item} onClick={() => Click(item - 1)}>
                  <Text state={item === count + 1}>{item}</Text>
                </Li>
              ))}
              <Li>
                <Text
                  onClick={() => {
                    if (
                      data.totalPage % 5 === 0
                        ? data.totalPage / 5 + 1 !== parseInt(count / 5) + 1
                        : parseInt(data.totalPage / 5) + 1 !==
                          parseInt(count / 5) + 1
                    ) {
                      setCount((parseInt(count / 5) + 1) * 5);
                    }
                  }}
                >
                  &gt;
                </Text>
              </Li>
              <Li>
                <Button onClick={() => setCount(data.totalPage - 1)}>
                  Last Page
                </Button>
              </Li>
            </Ul>
          </Table>
        </>
      )}
    </>
  );
};
export default Wait;
const Table = styled.div`
  margin: 200px auto;
  width: 1190px;
  height: 813px;
  background-color: ${(props) => props.theme.colors.mediumPurple};
  border-radius: 20px;
`;
const Li = styled.li`
  margin-left: -40px;
`;
const Text = styled.div`
  position: relative;
  font: 700 normal 23px "Roboto";
  color: ${(props) => props.theme.colors.black};
  width: 60px;
  height: 60px;
  padding-top: 15px;
  text-align: center;
  background-color: ${(props) =>
    props.state ? props.theme.colors.blue : props.theme.colors.mediumPurple};
  cursor: pointer;
  border-radius: 100%;
  :hover {
    background-color: ${(props) => props.theme.colors.blue};
    border-radius: 100%;
  }
`;
const Button = styled.div`
  width: 160px;
  height: 60px;
  border-radius: 100px;
  background-color: ${(props) => props.theme.colors.blue};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
  padding-top: 17px;
  cursor: pointer;
`;
const Ul = styled.ul`
  position: relative;
  top: ${(props) => props.top}px;
  width: 836px;
  height: 60px;
  list-style-type: none;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
`;
const Ulbox = styled.ul`
  position: relative;
  list-style-type: none;
  width: 1136px;
  top: 20px;
  margin: 0 auto;
`;
const Libox = styled.li`
  margin-top: 20px;
  margin-left: -40px;
`;
const Box = styled.div`
  width: 1136px;
  height: 80px;
  padding: 25px 20px 0px 65px;
  background-color: ${(props) => props.theme.colors.mediumGray};
  border-radius: 20px;
`;
const Category = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  margin-right: 50px;
  div {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 700 normal 24px "NanumGothic", sans-serif;
    color: ${(props) => props.theme.colors.blue};
    + div {
      width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font: 400 normal 20px "NanumGothic", sans-serif;
      color: ${(props) => props.theme.colors.black};
    }
  }
`;
const ButtonProps = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  left: 750px;
  top: -35px;
  gap: 54px;
  div {
    border-radius: 100px;
    text-align: center;
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.blue};
    width: 120px;
    height: 40px;
    font: 700 normal 14px "NanumGothic", sans-serif;
    padding-top: 10px;
    color: ${(props) => props.theme.colors.white};
  }
`;
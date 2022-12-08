import { Link } from "react-router-dom";
import headerStyle from "../../styles/layout/_Header.module.scss";
import PrimaryButton from "../Atoms/button/PrimaryButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../../Firebase";
import { GiFrogPrince } from "react-icons/gi";
import Hamburger from "hamburger-react";
import { useState } from "react";
// yarn add hamburger-react;
//yarn add react-helmet
//yarn add @types/react-helmet
//yarn add react-helmet-async
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const [flag, setFlag] = useState(false);

  // gestID（hJ2JnzBn）の入れ物
  const cookieList: any = [];

  useEffect(() => {
    // 以下、cookie取り出し処理
    const splitCookie = document.cookie.split(";");
    const list = [];

    for (let i = 0; i < splitCookie.length; i++) {
      list.push(splitCookie[i].split("="));
    }

    // cookieにgestID（hJ2JnzBn）がセットされていな場合、付与する
    list.map((data, index) => {
      if (data[0].includes("hJ2JnzBn")) {
        cookieList.push(data[0]);
      }
    });

    // gestID（hJ2JnzBn）が入っていなければ、ランダムな文字列をcookieに追加
    if (cookieList.length === 0) {
      let randomId = Math.random().toString(32).substring(2);
      document.cookie = `hJ2JnzBn=${randomId}; path=/;`;
    }
  }, []);

  //予約のイベント

  const flagChange = () => {
    if (flag === false) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  };

  return (
    <>
      <div className={headerStyle.headerFlex}>
        <Link to={"/"}>
          <h1>
            <GiFrogPrince /> Prince'View Hotel
          </h1>
        </Link>
        {flag ? (
          <div className={headerStyle.headerNav}>
            <ul>
              <li className={headerStyle.headerlist}>
                <Link to={"/rooms/Gestroom"}>
                  {" "}
                  <span className={headerStyle.headerspan}> 客室・プラン</span>
                </Link>
              </li>
              <li className={headerStyle.headerlist}>
                <Link to={"/books/Contact"}>
                  {" "}
                  <span className={headerStyle.headerspan}>
                    {" "}
                    よくあるご質問
                  </span>
                </Link>
              </li>
              {/* <li>
              <Link to={"/"}>ログイン</Link>
            </li> */}
              <Certification />
              <Link to={"/rooms/Gestroom"}>
                <PrimaryButton>ご予約</PrimaryButton>
              </Link>
            </ul>
            {/* <div className={headerStyle.ham}> */}
            <Hamburger
              toggled={isOpen}
              toggle={setOpen}
              size={30}
              onToggle={flagChange}
            />
            {/* </div> */}
          </div>
        ) : (
          <>
            <Hamburger
              toggled={isOpen}
              toggle={setOpen}
              size={30}
              onToggle={flagChange}
            />
          </>
        )}
      </div>
    </>
  );
};

// ログインログアウト判定
const Certification = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <li>
          <Link to={"/users/login"}>
            {" "}
            <span className={headerStyle.headerspan}>ログイン</span>{" "}
          </Link>
        </li>
      </>
    );
  } else {
    return (
      <>
        <li className={headerStyle.headerlist}>
          <Link to={"/books/ReservateHistory"}>
            <span className={headerStyle.headerspan}> 予約内容確認</span>
          </Link>
        </li>
        <li>
          <button
            className={headerStyle.headerspan}
            onClick={() => {
              auth.signOut().then(() => {
                alert("ログアウトしました。");
                navigate("/");
              });
            }}
          >
            ログアウト
          </button>
        </li>
      </>
    );
  }
};

export default Header;

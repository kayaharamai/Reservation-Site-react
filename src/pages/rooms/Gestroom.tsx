import RoomStyle from "../../styles/rooms/_Gestroom.module.scss";
import PrimaryButton from "../../components/Atoms/button/PrimaryButton";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/footer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import db from "../../Firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  endBefore,
} from "firebase/firestore";
import SecondryButton from "../../components/Atoms/button/SecondryButton";
import EmptyRoomConditions from "../../components/Templates/EmptyRoomConditions";
import Head from "../../components/layout/Head";
import PrimaryLink from "../../components/Atoms/PrimaryLink";
import SearchSoart from "../../components/Organisms/rooms/RoomSearchSoart";
import Pageing from "../../components/Organisms/rooms/Pageing";

type RoomProps = {
  classname?: string;
};

const GestroomPlan: React.FC<RoomProps> = () => {
  const [datetext, setDatetext] = useState("");
  const [info, setInfo] = useState([]);
  const [descClick, setDescClick] = useState(false);
  const [ascClick, setAscClick] = useState(false);
  const [err, setErr] = useState([]); //検索のバリデーション
  const [rooms, SetRooms] = useState<any>([]); //db取り出し
  const [room, setRoom] = useState<any>([]); //db取り出し
  const [reserved, setReserved] = useState<any>([]); //db取り出し
  return (
    <>
      <Head
        title="PrinceViewHotel-客室・プラン"
        description="ホテルの予約サイトです。-PrinceViewHotel-"
      />
      <Header />
      <div className={RoomStyle.hidden}>
        <p className={RoomStyle.pageTitle}>
          <IoSearchOutline size={28} />
          空室検索
        </p>
        <PrimaryLink
          title={"ご予約内容の確認はこちら"}
          path={"/books/ReservateHistory"}
          classname={RoomStyle.reservedCheck}
        />
        {err.map((error: string, index: number) => {
          return (
            <p key={index} className={RoomStyle.err}>
              ※{error}
            </p>
          );
        })}
        <EmptyRoomConditions
          datetext={datetext}
          setDatetext={setDatetext}
          setInfo={setInfo}
          reserved={reserved}
          room={room}
          setRoom={setRoom}
          rooms={rooms}
          SetRooms={SetRooms}
          setErr={setErr}
          setReserved={setReserved}
        />
        <p className={RoomStyle.pageTitle2}>全ての客室＆プラン</p>
        <div className={RoomStyle.roomLinkWrapper}></div>
        {err.map((error: string,index:number) => {
          return (
            <p key={index} className={RoomStyle.err}>
              ※{error}
            </p>
          );
        })}
        {info.map((information: string,index:number) => {
          return (
            <p key={index} className={RoomStyle.info}>
              ※{information}
            </p>
          );
        })}
        <RoomCard
          rooms={rooms}
          SetRooms={SetRooms}
          descClick={descClick}
          setDescClick={setDescClick}
          ascClick={ascClick}
          setAscClick={setAscClick}
        />
      </div>
      <Footer />
    </>
  );
};

//部屋の詳細
export const RoomCard = (props: any) => {
  const {
    rooms,
    SetRooms,
    SetPlans,
    descClick,
    setDescClick,
    ascClick,
    setAscClick,
  } = props;
  const [openAnswer, setOpenAnswer] = useState<any>({ 0: false });
  const soartData = collection(db, "gestRoomType");

  const navigate = useNavigate();

  useEffect(() => {
    const roomDate = query(soartData, orderBy("price"), limit(3));
    getDocs(roomDate).then((snapShot) => {
      SetRooms(snapShot.docs.map((doc) => ({ ...doc.data() })));
    });
  }, []);
  const [page, setPage] = useState(false);
  //次のページへ進むボタン
  const handleNextPage = async () => {
    setPage(true);
    if (descClick === true) {
      const priceDesc = query(soartData, orderBy("price", "desc"), limit(3));
      const data = await getDocs(priceDesc);
      const last = data.docs[data.docs.length - 1];
      const next = query(
        soartData,
        orderBy("price", "desc"),
        startAfter(last),
        limit(3)
      );
      const nextdata = await getDocs(next);
      const nextPage = nextdata.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      SetRooms(nextPage);
    } else if (ascClick === true) {
      const priceDesc = query(soartData, orderBy("price"), limit(3));
      const data = await getDocs(priceDesc);
      const last = data.docs[data.docs.length - 1];
      const next = query(
        soartData,
        orderBy("price"),
        startAfter(last),
        limit(3)
      );
      const nextdata = await getDocs(next);
      const nextPage = nextdata.docs.map((doc) => ({
        ...doc.data(),
      }));
      SetRooms(nextPage);
    } else {
      const priceDesc = query(soartData, orderBy("price"), limit(3));
      const data = await getDocs(priceDesc);
      const last = data.docs[data.docs.length - 1];
      const next = query(
        soartData,
        orderBy("price"),
        startAfter(last),
        limit(3)
      );
      const nextdata = await getDocs(next);
      const nextPage = nextdata.docs.map((doc) => ({
        ...doc.data(),
      }));
      SetRooms(nextPage);
    }
  };
  //前のページに戻るボタン

  const handlePrevPage = async () => {
    if (descClick === true) {
      const priceDesc = query(soartData, orderBy("price", "desc"), limit(3));
      const data = await getDocs(priceDesc);
      const newDescData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      SetRooms(newDescData);
    } else {
      const p = query(soartData, orderBy("price"), limit(4));
      const data = await getDocs(p);
      const descPrev = data.docs[data.docs.length - 1];
      const next = query(
        soartData,
        orderBy("price"),
        endBefore(descPrev),
        limit(3)
      );
      const descPrevdata = await getDocs(next);
      const prevPage = descPrevdata.docs.map((doc) => ({
        ...doc.data(),
      }));
      SetRooms(prevPage);
    }
  };
  const handleOpenAnswer = (index: any) => {
    setOpenAnswer((prevState: any) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <>
      <div className={RoomStyle.roomPlanContainer}>
        <ul>
          {rooms.length !== 1 ? (
            <SearchSoart
              SetPlans={SetPlans}
              SetRooms={SetRooms}
              rooms={rooms}
              descClick={descClick}
              setDescClick={setDescClick}
              ascClick={ascClick}
              setAscClick={setAscClick}
            />
          ) : (
            <></>
          )}
          {rooms.map((room: any, index: any) => {
            return (
              <li key={room.area} className={RoomStyle.roomPlanCard}>
                <div className={RoomStyle.cardTitle}>
                  <h1 className={RoomStyle.roomName}>{room.area}</h1>
                  <p className={RoomStyle.roomArea}>{room.capacityArea}</p>
                </div>
                <div className={RoomStyle.detailContainer}>
                  <img
                    className={RoomStyle.roompic}
                    src={room.image}
                    alt="roompicture"
                  />
                  <div className={RoomStyle.roomDetails}>
                    <p className={RoomStyle.roomCapacity}>
                      定員{room.capacity}名
                    </p>
                    <p className={RoomStyle.bedType}>
                      ベッドタイプ｜{room.bedType}
                    </p>
                    <p className={RoomStyle.roomEquipmentTitle}>
                      【客室室内設備】
                    </p>
                    <p className={RoomStyle.roomEquipment}>
                      {room.roomFacility}
                    </p>
                    <p className={RoomStyle.roomPrice}>
                      ¥{room.price.toLocaleString()}
                      <span>〜/人</span>
                    </p>
                  </div>
                </div>
                <div className={RoomStyle.ResarvedRoomBtn}>
                  <PrimaryButton
                    onClick={() => {
                      navigate(
                        `/rooms/RoomDetails?room=${room.Id}`
                      );
                    }}
                  >
                    空室を探す
                  </PrimaryButton>
                </div>
                <div className={RoomStyle.roomplanWrapper}>
                  <p className={RoomStyle.roomplan}>プラン</p>
                  {openAnswer ? (
                    <button
                      onClick={() => handleOpenAnswer(index)}
                      className={RoomStyle.roomplanbutton}
                    >
                      もっと見る・・・
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenAnswer(index)}
                      className={RoomStyle.roomplanbutton}
                    >
                      元に戻す
                    </button>
                  )}
                </div>
                {ascClick === true && descClick === false ? (
                  <>
                    <div className={RoomStyle.roomplanCards}>
                      <img
                        width={200}
                        src="/gestroomPlan/4.png"
                        alt="roompicture"
                      />
                      <div className={RoomStyle.roomplanContainer}>
                        <p className={RoomStyle.roomplantext}>{room.plan1}</p>
                        <div className={RoomStyle.roomplanButton}>
                          <SecondryButton
                            onClick={() => {
                              navigate(
                                `/rooms/PlanDetails?plan1=${room.plan1}&room=${room.Id}`
                              );
                            }}
                          >
                            このプランで探す
                          </SecondryButton>
                        </div>
                      </div>
                    </div>
                    {openAnswer[index] ? (
                      <div>
                        <div className={RoomStyle.roomplanCards}>
                          <img
                            width={200}
                            src="/gestroomPlan/フリーWi-Fi.jpg"
                            alt="roompicture"
                          />
                          <div className={RoomStyle.roomplanContainer}>
                            <p className={RoomStyle.roomplantext}>
                              {room.plan2}
                            </p>
                            <div className={RoomStyle.roomplanButton}>
                              <SecondryButton
                                onClick={() => {
                                  navigate(
                                    `/rooms/PlanDetails?plan2=${room.plan2}&room=${room.Id}`
                                  );
                                }}
                              >
                                このプランで探す
                              </SecondryButton>
                            </div>
                          </div>
                        </div>
                        {room.plan3 ? (
                          <div className={RoomStyle.roomplanCards}>
                            <img
                              width={200}
                              height={165}
                              src={room.image}
                              alt="roompicture"
                            />
                            <div className={RoomStyle.roomplanContainer}>
                              <p className={RoomStyle.roomplantext}>
                                {room.plan3}
                              </p>
                              <div className={RoomStyle.roomplanButton}>
                                <SecondryButton
                                  onClick={() => {
                                    navigate(
                                      `/rooms/PlanDetails?plan3=${room.plan3}&room=${room.Id}`
                                    );
                                  }}
                                >
                                  このプランで探す
                                </SecondryButton>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        {room.plan4 ? (
                          <div className={RoomStyle.roomplanCards}>
                            <img
                              width={200}
                              height={200}
                              src="/gestroomPlan/breakfast-1.jpg"
                              alt="roompicture"
                            />
                            <div className={RoomStyle.roomplanContainer}>
                              <p className={RoomStyle.roomplantext}>
                                {room.plan4}
                              </p>
                              <div className={RoomStyle.roomplanButton}>
                                <SecondryButton
                                  onClick={() => {
                                    navigate(
                                      `/rooms/PlanDetails?plan4=${room.plan4}&room=${room.Id}`
                                    );
                                  }}
                                >
                                  このプランで探す
                                </SecondryButton>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <p>
                          ※表示されている料金は参考価格です。予約内容確認画面で最終的な料金をご確認ください。
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : descClick === true && ascClick === false ? (
                  <>
                    <div className={RoomStyle.roomplanCards}>
                      <img
                        width={200}
                        src="/gestroomPlan/4.png"
                        alt="roompicture"
                      />
                      <div className={RoomStyle.roomplanContainer}>
                        <p className={RoomStyle.roomplantext}>{room.plan1}</p>
                        <div className={RoomStyle.roomplanButton}>
                          <SecondryButton
                            onClick={() => {
                              navigate(
                                `/rooms/PlanDetails?plan1=${room.plan1}&ad3r=${room.area}`
                              );
                            }}
                          >
                            このプランで探す
                          </SecondryButton>
                        </div>
                      </div>
                    </div>
                    {openAnswer[index] ? (
                      <div>
                        <div className={RoomStyle.roomplanCards}>
                          <img
                            width={200}
                            src="/gestroomPlan/フリーWi-Fi.jpg"
                            alt="roompicture"
                          />
                          <div className={RoomStyle.roomplanContainer}>
                            <p className={RoomStyle.roomplantext}>
                              {room.plan2}
                            </p>
                            <div className={RoomStyle.roomplanButton}>
                              <SecondryButton
                                onClick={() => {
                                  navigate(
                                    `/rooms/PlanDetails?plan2=${room.plan2}&ad3r=${room.area}`
                                  );
                                }}
                              >
                                このプランで探す
                              </SecondryButton>
                            </div>
                          </div>
                        </div>
                        {room.plan3 ? (
                          <div className={RoomStyle.roomplanCards}>
                            <img
                              width={200}
                              height={165}
                              src={room.image}
                              alt="roompicture"
                            />
                            <div className={RoomStyle.roomplanContainer}>
                              <p className={RoomStyle.roomplantext}>
                                {room.plan3}
                              </p>
                              <div className={RoomStyle.roomplanButton}>
                                <SecondryButton
                                  onClick={() => {
                                    navigate(
                                      `/rooms/PlanDetails?plan3=${room.plan3}&ad3r=${room.area}`
                                    );
                                  }}
                                >
                                  このプランで探す
                                </SecondryButton>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        {room.plan4 ? (
                          <div className={RoomStyle.roomplanCards}>
                            <img
                              width={200}
                              height={200}
                              src="/gestroomPlan/breakfast-1.jpg"
                              alt="roompicture"
                            />
                            <div className={RoomStyle.roomplanContainer}>
                              <p className={RoomStyle.roomplantext}>
                                {room.plan4}
                              </p>
                              <div className={RoomStyle.roomplanButton}>
                                <SecondryButton
                                  onClick={() => {
                                    navigate(
                                      `/rooms/PlanDetails?plan4=${room.plan4}&ad3r=${room.area}`
                                    );
                                  }}
                                >
                                  このプランで探す
                                </SecondryButton>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <p>
                          ※表示されている料金は参考価格です。予約内容確認画面で最終的な料金をご確認ください。
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    <div className={RoomStyle.roomplanCards}>
                      <img
                        width={200}
                        src="/gestroomPlan/4.png"
                        alt="roompicture"
                      />
                      <div className={RoomStyle.roomplanContainer}>
                        <p className={RoomStyle.roomplantext}>{room.plan1}</p>
                        <div className={RoomStyle.roomplanButton}>
                          <SecondryButton
                            onClick={() => {
                              navigate(
                                `/rooms/PlanDetails?plan1=${room.plan1}`
                              );
                            }}
                          >
                            このプランで探す
                          </SecondryButton>
                        </div>
                      </div>
                    </div>
                    {openAnswer[index] ? (
                      <div>
                        <div className={RoomStyle.roomplanCards}>
                          <img
                            width={200}
                            src="/gestroomPlan/フリーWi-Fi.jpg"
                            alt="roompicture"
                          />
                          <div className={RoomStyle.roomplanContainer}>
                            <p className={RoomStyle.roomplantext}>
                              {room.plan2}
                            </p>
                            <div className={RoomStyle.roomplanButton}>
                              <SecondryButton
                                onClick={() => {
                                  navigate(
                                    `/rooms/PlanDetails?plan2=${room.plan2}`
                                  );
                                }}
                              >
                                このプランで探す
                              </SecondryButton>
                            </div>
                          </div>
                        </div>
                        {room.plan3 ? (
                          <div className={RoomStyle.roomplanCards}>
                            <img
                              width={200}
                              height={165}
                              src={room.image}
                              alt="roompicture"
                            />
                            <div className={RoomStyle.roomplanContainer}>
                              <p className={RoomStyle.roomplantext}>
                                {room.plan3}
                              </p>
                              <div className={RoomStyle.roomplanButton}>
                                <SecondryButton
                                  onClick={() => {
                                    navigate(
                                      `/rooms/PlanDetails?plan3=${room.plan3}`
                                    );
                                  }}
                                >
                                  このプランで探す
                                </SecondryButton>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        {room.plan4 ? (
                          <div className={RoomStyle.roomplanCards}>
                            <img
                              width={200}
                              height={200}
                              src="/gestroomPlan/breakfast-1.jpg"
                              alt="roompicture"
                            />
                            <div className={RoomStyle.roomplanContainer}>
                              <p className={RoomStyle.roomplantext}>
                                {room.plan4}
                              </p>
                              <div className={RoomStyle.roomplanButton}>
                                <SecondryButton
                                  onClick={() => {
                                    navigate(
                                      `/rooms/PlanDetails?plan4=${room.plan4}`
                                    );
                                  }}
                                >
                                  このプランで探す
                                </SecondryButton>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <p>
                          ※表示されている料金は参考価格です。予約内容確認画面で最終的な料金をご確認ください。
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {rooms.length !== 1 ? (
        <Pageing onPrevClick={handlePrevPage} onNextClick={handleNextPage} />
      ) : page === true ? (
        <Pageing onPrevClick={handlePrevPage} onNextClick={handleNextPage} />
      ) : (
        <Link
          to={"/rooms/Gestroom"}
          onClick={() => window.location.reload()}
          className={RoomStyle.alldisplayLink}
        >
          →全て表示する
        </Link>
      )}
    </>
  );
};

export default GestroomPlan;

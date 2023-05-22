import React, { useState } from 'react';
import api from '../api';

const Users = () => {
  ///////////////////////////////////////
  const [users, setUsers] = useState(api.users.fetchAll());
  ///////////////////////////////////////
  const handleDelete = (userId) => {
    let newArr = users.filter((i) => i._id !== userId);
    setUsers(newArr);
  };
  ///////////////////////////////////////
  const renderPhrase = (number) => {
    let lastCount = +String(number)[String(number).length - 1];
    let penCount = +String(number)[String(number).length - 2];
    let tusa;
    if (lastCount === 1 && penCount !== 1) tusa = ' тусанёт';
    else tusa = ' тусанут';
    let man; /* 2 3 4 */
    if (
      (lastCount === 2 || lastCount === 3 || lastCount === 4) &&
      penCount !== 1
    )
      man = ' человека';
    else man = ' человек';
    ///////////////////////////////////////
    return number !== 0 ? (
      <>
        <div className="p-2 m-1 fs-6 badge bg-primary">
          {number} {man} {tusa} с тобой сегодня
        </div>
      </>
    ) : (
      <>
        <div className="p-2 m-1 fs-6 badge bg-danger">
          Никто с тобой не тусанёт
        </div>
      </>
    );
  };
  return (
    <>
      {renderPhrase(users.length)}
      <table className="table table-group-divider">
        <thead>
          <tr>
            <th scope="col">Имя</th>
            <th scope="col">Качества</th>
            <th scope="col">Профессия</th>
            <th scope="col">Встретился, раз</th>
            <th scope="col">Оценка</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {/* /////////////////////////////////////// */}
          {users.map((i) => {
            return (
              <tr id={i._id} key={i.name}>
                <td key="1">{i.name}</td>
                <td key="2">
                  {i.qualities.map((i) => {
                    const name = `m-1 badge bg-${i.color}`;
                    return (
                      <span className={name} key={i.name}>
                        {i.name}
                      </span>
                    );
                  })}
                </td>
                <td key="3">{i.profession.name}</td>
                <td key="4">{i.completedMeetings}</td>
                <td key="5">{i.rate} /5</td>
                <td key="bttn">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(i._id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            );
          })}
          {/* /////////////////////////////////////// */}
        </tbody>
      </table>
    </>
  );
};

export default Users;

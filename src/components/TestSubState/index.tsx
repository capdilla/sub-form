import { CreateSubState } from "../../lib/hooks/useSubState/CreateState";

import { useEffect, useState } from "react";

const tableStyle = {
  border: "1px solid",
};

const defaultValue = {
  data: [
    { name: "name1", isSelected: true },
    { name: "name2", isSelected: false },
    { name: "name3", isSelected: true },
    { name: "name4", isSelected: false },
    { name: "name5", isSelected: false },
    { name: "name7", isSelected: false },
    { name: "name8", isSelected: false },
    { name: "name6", isSelected: false },
    { name: "name5", isSelected: false },
  ],
};

const state = new CreateSubState(defaultValue);

interface SelectedProps {
  index: number;
  value: boolean;
}
const Selected = ({ index }: SelectedProps) => {
  const { value } = state.useValue({
    key: "data",
    observeValue: (state) => state[index].isSelected,
  });

  const onClick = () => {
    const newData = [...state.observer.state.data];
    newData[index].isSelected = !value;
    state.observer.setKeyState("data", newData);
  };

  return (
    <td>
      <button onClick={onClick}> {value.toString()}</button>
    </td>
  );
};

const Rows = () => {
  const { value } = state.useValue({ key: "data" });

  return (
    <>
      <tbody>
        {value.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <Selected index={index} value={item.isSelected} />
          </tr>
        ))}
      </tbody>
    </>
  );
};

export const TestSubState = () => {
  useEffect(() => {
    console.log("TestSubState");
  }, []);

  const onClick = () => {
    const olData = state.observer.state.data;
    const newData = [...olData];
    newData.push({ name: "newName", isSelected: false });
    state.observer.setKeyState("data", newData);
  };

  return (
    <div>
      <button onClick={onClick}>Add more data</button>
      <table style={{ ...tableStyle }}>
        <thead>
          <tr>
            <th>name</th>
            <th>isSelected</th>
          </tr>
        </thead>
        <Rows />
      </table>
    </div>
  );
};

interface SelectedUseStateProps {
  setData: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        isSelected: boolean;
      }[]
    >
  >;
  index: number;
  value: boolean;
}
const SelectedUseState = ({ index, setData, value }: SelectedUseStateProps) => {
  const handleOnClick = () => {
    setData((oldState) => {
      const newData = [...oldState];
      newData[index].isSelected = !value;

      return newData;
    });
  };

  return (
    <td>
      <button onClick={handleOnClick}> {value.toString()}</button>
    </td>
  );
};

export const TestUseState = () => {
  const [data, setData] = useState(defaultValue.data);

  const onClick = () => {
    const newData = [...data];
    newData.push({ name: "newName", isSelected: false });

    setData(newData);
  };

  return (
    <div>
      <button onClick={onClick}>Add more data</button>
      <table style={{ ...tableStyle }}>
        <thead>
          <tr>
            <th>name</th>
            <th>isSelected</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <SelectedUseState
                index={index}
                setData={setData}
                value={item.isSelected}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import React, { useState } from "react";
import "./App.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const images = [
  {
    id: 1,
    src: "/images/image-1.webp",
    alt: "Image 1",
    rowSpan: 2,
    colSpan: 2,
    checked: false,
  },
  // ... other images
];

function App() {
  const [characters, updateCharacters] = useState(images);

  function handleCheckboxChange(id) {
    const updatedCharacters = characters.map((image) =>
      image.id === id ? { ...image, checked: !image.checked } : image
    );
    updateCharacters(updatedCharacters);
  }
  function handleDrop(draggedId, targetId) {
    const updatedCharacters = [...characters];
    const draggedIndex = updatedCharacters.findIndex(
      (image) => image.id === draggedId
    );
    const targetIndex = updatedCharacters.findIndex(
      (image) => image.id === targetId
    );
    const draggedImage = updatedCharacters[draggedIndex];

    updatedCharacters.splice(draggedIndex, 1);
    updatedCharacters.splice(targetIndex, 0, draggedImage);
    updateCharacters(updatedCharacters);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="top-container">
          <div className="top-section"></div>
        </div>
        <hr />
        <ul className="image-gallery">
          {characters.map((image, index) => (
            <DraggableImage
              key={image.id}
              image={image}
              onCheckboxChange={() => handleCheckboxChange(image.id)}
              onDrop={(draggedId) => handleDrop(draggedId, image.id)}
            />
          ))}
        </ul>
        <div className="add-image-container">
          <button className="add-image-button">Add Image</button>
        </div>
      </div>
    </DndProvider>
  );
}

function DraggableImage({ image, onCheckboxChange, onDrop }) {
  const [{ isDragging }, drag] = useDrag({
    type: "IMAGE",
    item: { id: image.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop({
    accept: "IMAGE",
    drop: () => {
      onDrop(image.id); // Pass the target image id directly
    },
  });
  return (
    <li
      ref={(node) => drag(drop(node))}
      className="image-container"
      style={{
        gridRow: `span ${image.rowSpan || 1}`,
        gridColumn: `span ${image.colSpan || 1}`,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <label className="image-checkbox-label">
        <input
          className="image-checkbox-input"
          type="checkbox"
          checked={image.checked}
          onChange={() => onCheckboxChange(image.id)}
        />
        <img src={image.src} alt={image.alt} />
      </label>
    </li>
  );
}

export default App;

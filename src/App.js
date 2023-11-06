import React, { useState, Component } from "react";
import "./App.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const images = [
  {
    id: 1,
    src: "/images/image-1.webp",
    alt: "Image 1",
    checked: false,
  },

  {
    id: 2,
    src: "/images/image-2.webp",
    alt: "Image 3",
    checked: false,
  },
  {
    id: 3,
    src: "/images/image-3.webp",
    alt: "Image 3",
    checked: false,
  },
  {
    id: 4,
    src: "/images/image-4.webp",
    alt: "Image 4",
    checked: false,
  },
  {
    id: 5,
    src: "/images/image-5.webp",
    alt: "Image 5",
    checked: false,
  },
  {
    id: 6,
    src: "/images/image-6.webp",
    alt: "Image 6",
    checked: false,
  },
  {
    id: 7,
    src: "/images/image-7.webp",
    alt: "Image 7",
    checked: false,
  },
  {
    id: 8,
    src: "/images/image-8.webp",
    alt: "Image 8",
    checked: false,
  },
  {
    id: 9,
    src: "/images/image-9.webp",
    alt: "Image 9",
    checked: false,
  },
  {
    id: 10,
    src: "/images/image-10.jpeg",
    alt: "Image 10",
    checked: false,
  },
  {
    id: 11,
    src: "/images/image-11.jpeg",
    alt: "Image 11",
    checked: false,
  },
];

function App() {
  const [imageOrder, setImageOrder] = useState(images.map((image) => image.id));
  const [checkedImages, setCheckedImages] = useState([]);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  const handleChange = (id) => {
    const updatedOrder = imageOrder.map((imageId) =>
      imageId === id ? id : imageId
    );
    setImageOrder(updatedOrder);

    if (checkedImages.includes(id)) {
      setCheckedImages(checkedImages.filter((imageId) => imageId !== id));
    } else {
      setCheckedImages([...checkedImages, id]);
    }
  };

  const handleImageMove = (dragIndex, hoverIndex) => {
    const updatedOrder = [...imageOrder];
    const [dragId] = updatedOrder.splice(dragIndex, 1);
    updatedOrder.splice(hoverIndex, 0, dragId);
    setImageOrder(updatedOrder);
  };

  const handleDeleteCheckedImages = () => {
    const updatedOrder = imageOrder.filter(
      (imageId) => !checkedImages.includes(imageId)
    );
    setImageOrder(updatedOrder);
    setCheckedImages([]);
    setShowDeleteMessage(false);
  };
  const isCheckboxesSelected = checkedImages.length > 0;
  const checkedImagesCount = checkedImages.length;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="top-container">
          {checkedImagesCount === 0 && (
            <div className="top-section">Gallery</div>
          )}
          {isCheckboxesSelected && (
            <button
              className="delete-checked-images-button"
              onClick={handleDeleteCheckedImages}
            >
              Delete
            </button>
          )}
          {isCheckboxesSelected && (
            <div className="delete-message">
              {` ${checkedImagesCount} ${
                checkedImagesCount === 1 ? "File Selected" : "Files Selected"
              }`}
            </div>
          )}
        </div>
        <hr />
        <ul className="image-gallery">
          {imageOrder.map((imageId, index) => {
            const image = images.find((img) => img.id === imageId);
            const isFirstImage = index === 0;
            return (
              <DraggableImage
                key={image.id}
                image={image}
                onCheckboxChange={() => handleChange(image.id)}
                onboxChange={handleChange}
                onImageMove={handleImageMove}
                index={index}
                isChecked={checkedImages.includes(image.id)}
                isFirstImage={isFirstImage}
              />
            );
          })}
        </ul>
      </div>
    </DndProvider>
  );
}

function DraggableImage({
  image,
  onCheckboxChange,
  onImageMove,
  index,
  isChecked,
  isFirstImage,
}) {
  const [, ref] = useDrag({
    type: "IMAGE",
    item: { id: image.id, index },
  });

  const [, drop] = useDrop({
    type: "IMAGE",
    accept: "IMAGE",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onImageMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <li
      ref={(node) => ref(drop(node))}
      className={`image-container ${isFirstImage ? "first-image" : ""}`}
    >
      <label className="image-checkbox-label">
        <input
          className="image-checkbox-input"
          type="checkbox"
          checked={isChecked}
          onChange={onCheckboxChange}
        />
        <img src={image.src} alt={image.alt} />
      </label>
    </li>
  );
}

export default App;

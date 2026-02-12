import React, { useState } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Textarea from "../components/TextArea";
import LoginForm from "../components/LoginForm";


const TestPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Button label="open modal" onClick={openModal}></Button>
    <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LoginForm/>
    </Modal>
    <Textarea label="Description" name="description" placeholder="Enter description" />
    </div>
  );
};

export default TestPage;

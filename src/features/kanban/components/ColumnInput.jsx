import React from 'react';
import styles from '../../../styles/App.module.css';
import {IoCheckmarkDoneOutline} from "react-icons/io5";
import {RxCross1} from "react-icons/rx";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx";

const ColumnInput = ({
                         boardId,
                         newColumnTitle,
                         setNewColumnTitle,
                         setShowColumnInput,
                         handleCreateColumn
                     }) => (
    <div className={styles.columnInputContainer}>
        <input
            className={styles.defaultInput}
            type="text"
            placeholder="Название столбца..."
            value={newColumnTitle}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateColumn(boardId)}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            autoFocus
        />
        <div className={styles.columnInputActions}>
            <DefaultBtn
                variant="createConfirmBtn"
                icon={IoCheckmarkDoneOutline}
                onClick={() => handleCreateColumn(boardId)}
            >
                Добавить
            </DefaultBtn>

            <DefaultBtn
                variant="cancelBtn"
                icon={RxCross1}
                onClick={() => {
                    setShowColumnInput(false);
                    setNewColumnTitle('');
                }}
            >
                Отмена
            </DefaultBtn>
        </div>
    </div>
);

export default ColumnInput;
import React from 'react';
import {FaPlus} from "react-icons/fa";
import ColumnInput from "./ColumnInput.jsx";
import styles from '../../../styles/App.module.css';
import KanbanColumn from "./KanbanColumn.jsx";

const KanbanBoardSection = ({
                                boards,
                                showColumnInput,
                                newColumnTitle,
                                setShowColumnInput,
                                setNewColumnTitle,
                                handleCreateColumn
                            }) => {
    return (
        <div className={styles.boardsContainer}>
            {boards.map(board => (
                <div key={board.id} className={styles.board}>
                    <div className={styles.boardHeader}>
                        <h3 className={styles.boardTitle}>{board.title}</h3>
                        <button
                            className={`${styles.defaultBtn} ${styles.addColumnBtn}`}
                            onClick={() => setShowColumnInput(true)}
                        >
                            <FaPlus className={styles.icon}/>Добавить столбец
                        </button>
                    </div>
                    <hr/>

                    {showColumnInput && (
                        <ColumnInput
                            boardId={board.id}
                            newColumnTitle={newColumnTitle}
                            setNewColumnTitle={setNewColumnTitle}
                            setShowColumnInput={setShowColumnInput}
                            handleCreateColumn={handleCreateColumn}
                        />
                    )}

                    <div className={styles.columnsContainer}>
                        {board.columns.map(column => (
                            <KanbanColumn key={column.id} column={column}/>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


export default KanbanBoardSection;
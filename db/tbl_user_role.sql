-- ============================================================================
-- MSTP_USER_ROLE 用户角色关联表
-- ============================================================================

CREATE TABLE MSTP.MSTP_USER_ROLE (
    ID              NUMBER(20)      NOT NULL,
    USER_ID         VARCHAR2(50)    NOT NULL,
    ROLE_CODE       VARCHAR2(30)    NOT NULL,
    CREATED_BY      VARCHAR2(50)    NOT NULL,
    CREATED_TIME    TIMESTAMP(6)    DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_USER_ROLE PRIMARY KEY (ID),
    CONSTRAINT FK_UR_USER FOREIGN KEY (USER_ID) REFERENCES MSTP.MSTP_USER(USER_ID),
    CONSTRAINT FK_UR_ROLE FOREIGN KEY (ROLE_CODE) REFERENCES MSTP.MSTP_ROLE(ROLE_CODE)
);

CREATE INDEX MSTP.IDX_UR_USER_ID ON MSTP.MSTP_USER_ROLE (USER_ID);
CREATE INDEX MSTP.IDX_UR_ROLE_CODE ON MSTP.MSTP_USER_ROLE (ROLE_CODE);

COMMENT ON TABLE  MSTP.MSTP_USER_ROLE IS '用户角色关联表';

-- ============================================================================
-- Initial Data
-- ============================================================================
INSERT INTO MSTP.MSTP_USER_ROLE (ID, USER_ID, ROLE_CODE, CREATED_BY, CREATED_TIME)
VALUES (MSTP.SEQ_USER_ROLE.NEXTVAL, 'admin', 'ADMIN', 'SYSTEM', SYSTIMESTAMP);

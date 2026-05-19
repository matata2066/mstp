-- ============================================================================
-- MSTP_USER 用户表
-- ============================================================================

CREATE TABLE MSTP.MSTP_USER (
    ID              NUMBER(20)      NOT NULL,
    USER_ID         VARCHAR2(50)    NOT NULL,
    USER_NAME       VARCHAR2(100)   NOT NULL,
    EMAIL           VARCHAR2(100),
    STATUS          VARCHAR2(10)    DEFAULT 'ACTIVE' NOT NULL,
    PASSWORD_HASH   VARCHAR2(200),
    LAST_LOGIN_TIME TIMESTAMP(6),
    IS_DELETED      NUMBER(1)       DEFAULT 0 NOT NULL,
    CREATED_BY      VARCHAR2(50)    NOT NULL,
    CREATED_TIME    TIMESTAMP(6)    DEFAULT SYSTIMESTAMP NOT NULL,
    UPDATED_BY      VARCHAR2(50)    NOT NULL,
    UPDATED_TIME    TIMESTAMP(6)    DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_USER PRIMARY KEY (ID),
    CONSTRAINT CK_USER_STATUS CHECK (STATUS IN ('ACTIVE', 'LOCKED', 'DISABLED')),
    CONSTRAINT CK_USER_DELETED CHECK (IS_DELETED IN (0, 1))
);

CREATE UNIQUE INDEX MSTP.UK_USER_ID ON MSTP.MSTP_USER (USER_ID, IS_DELETED);

COMMENT ON TABLE  MSTP.MSTP_USER IS '用户表';
COMMENT ON COLUMN MSTP.MSTP_USER.USER_ID IS '用户ID(业务主键)';
COMMENT ON COLUMN MSTP.MSTP_USER.STATUS IS '状态: ACTIVE/LOCKED/DISABLED';
COMMENT ON COLUMN MSTP.MSTP_USER.PASSWORD_HASH IS '密码哈希(Local模式使用)';

-- ============================================================================
-- Initial Data
-- ============================================================================
INSERT INTO MSTP.MSTP_USER (ID, USER_ID, USER_NAME, EMAIL, STATUS, PASSWORD_HASH, IS_DELETED, CREATED_BY, CREATED_TIME, UPDATED_BY, UPDATED_TIME)
VALUES (MSTP.SEQ_USER.NEXTVAL, 'admin', '系统管理员', 'admin@mstp.local', 'ACTIVE',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        0, 'SYSTEM', SYSTIMESTAMP, 'SYSTEM', SYSTIMESTAMP);

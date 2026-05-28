package com.mstp;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.OracleContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@Testcontainers
public abstract class BaseIntegrationTest {

    @Container
    @ServiceConnection
    static OracleContainer oracle = new OracleContainer(
            DockerImageName.parse("gvenzl/oracle-xe:21-slim")
    )
    .withDatabaseName("XEPDB1")
    .withUsername("mstp")
    .withPassword("mstp");
}

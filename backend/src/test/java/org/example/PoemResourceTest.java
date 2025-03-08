package org.example;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
class PoemResourceTest {
    
    @Test
    void testGetAllPoems() {
        given()
          .when().get("/api/poems")
          .then()
             .statusCode(200)
             .body("size()", is(notNullValue()));
    }

    @Test
    void testGetPoemByInvalidId() {
        given()
          .when().get("/api/poems/invalid-id")
          .then()
             .statusCode(404);
    }
}

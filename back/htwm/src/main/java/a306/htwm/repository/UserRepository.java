package a306.htwm.repository;

import a306.htwm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    @Query(nativeQuery = true, value = "select * from user " +
            "where nickname like %:string%")
    ArrayList<User> findByString(@Param("string") String string);
}

package a306.htwm.repository;

import a306.htwm.entity.Picture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

public interface PictureRepository extends JpaRepository<Picture, Long> {

    @Query(nativeQuery = true, value = "select * from picture " +
            "where user_id = :userid and datetime = :datetime")
    Optional<Picture> findOneByUsernameAndDatetime(@Param("userid") Long userid, @Param("datetime") String datetime);

    @Query(nativeQuery = true, value = "select * from picture " +
            "where user_id = :id and datetime like :date%")
    ArrayList<Picture> findAllByUserIdAndDate(Long id, String date);
}

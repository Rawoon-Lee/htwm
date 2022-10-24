package a306.htwm.repository;

import a306.htwm.entity.Picture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface PictureRepository extends JpaRepository<Picture, Long> {

}

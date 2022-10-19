package a306.htwm.repository;

import a306.htwm.entity.Mirror;
import a306.htwm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MirrorRepository extends JpaRepository<Mirror, Long> {

    Mirror findByUuid(String uuid);
}

package a306.htwm.service;

import a306.htwm.entity.Picture;
import a306.htwm.repository.PictureRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class PictureService {
    private final PictureRepository pictureRepository;
    private final UserRepository userRepository;

    @Transactional
    public void join(String url,String username){
        Picture picture = new Picture();
        picture.setDatetime(LocalDateTime.now());
        picture.setUrl(url);
        picture.setUser(userRepository.findByUsername(username));

        pictureRepository.save(picture);
    }
}

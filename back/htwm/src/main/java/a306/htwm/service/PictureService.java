package a306.htwm.service;

import a306.htwm.config.S3Uploader;
import a306.htwm.dto.PictureDTO;
import a306.htwm.entity.Picture;
import a306.htwm.repository.PictureRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class PictureService {
    private final PictureRepository pictureRepository;
    private final UserRepository userRepository;
    private final S3Uploader s3Uploader;

    @Transactional
    public void join(String url,String username){
        Picture picture = new Picture();
        picture.setDatetime(LocalDateTime.now());
        picture.setUrl(url);
        picture.setUser(userRepository.findByUsername(username));

        pictureRepository.save(picture);
    }

    @Transactional
    public void delete(String username, String dateTime) {
        Long userid = userRepository.findByUsername(username).getId();
        Optional<Picture> picture = pictureRepository.findOneByUsernameAndDatetime(userid,dateTime);
        if(picture.isEmpty()) throw new RuntimeException("해당 사진이 없습니다.");

        Picture realPic = picture.get();
        s3Uploader.deleteFile(realPic.getUrl());
        pictureRepository.delete(realPic);
    }

    public ArrayList<PictureDTO> getPic(String username, String date) {
        if(userRepository.findByUsername(username)==null) throw new RuntimeException("no such username");
        ArrayList<Picture> pics = pictureRepository.findAllByUserIdAndDate(userRepository.findByUsername(username).getId(),date);
        ArrayList<PictureDTO> pictureDTOS = new ArrayList<>();
        for(Picture pic : pics ){
            PictureDTO pictureDTO = PictureDTO.builder()
                    .date(pic.getDatetime())
                    .url(pic.getUrl())
                    .build();
            pictureDTOS.add(pictureDTO);
        }
        return pictureDTOS;
    }
}

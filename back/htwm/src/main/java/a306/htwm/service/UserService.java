package a306.htwm.service;

import a306.htwm.dto.EditDTO;
import a306.htwm.dto.RegisterDTO;
import a306.htwm.entity.Mirror;
import a306.htwm.entity.User;
import a306.htwm.repository.MirrorRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MirrorRepository mirrorRepository;

    @Transactional
    public void register(RegisterDTO registerDTO) {
        User user = userRepository.findByUsername(registerDTO.getUsername());
        Mirror mirror = mirrorRepository.findByUuid(registerDTO.getUuid());
        user.setMirror(mirror);
    }

    @Transactional
    public void edit(EditDTO editDTO) {
        User user = userRepository.findByUsername(editDTO.getUsername());
        user.setNickname(editDTO.getNickname());
        user.setHeight(editDTO.getHeight());
    }
}

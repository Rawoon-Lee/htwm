package a306.htwm.controller;

import a306.htwm.dto.EditDTO;
import a306.htwm.dto.RegisterDTO;
import a306.htwm.dto.WeightDTO;
import a306.htwm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterDTO registerDTO){
        try{
            userService.register(registerDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body("invalid username or uuid");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/edit")
    public ResponseEntity edit(@RequestBody EditDTO editDTO){
        try{
            userService.edit(editDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/weight")
    public ResponseEntity weight(@RequestBody WeightDTO weightDTO){
        try{
            userService.weight(weightDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }
}
